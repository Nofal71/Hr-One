import axios from "axios";
import axiosInstance from "../axiosInstance";
import path from "path";
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
import mammoth from "mammoth";
import { generateResumeEvaluationPrompt, SYSTEM_PROMPT } from "./prompts";

export const API_URL = "https://openrouter.ai/api/v1/chat/completions";
export const MODEL = "google/gemini-2.0-flash-001";
export const API_KEY = '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';
// export const API_KEY = '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';

export const calculateCurrentDuration = (Clockin: string | undefined) => {
  if (!Clockin) return null;

  const clockInTime = new Date(Clockin);
  const now = new Date();

  const diffMs = now.getTime() - clockInTime.getTime();

  if (diffMs < 0) return '0h 0m';

  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);

  return `${hours}h ${minutes}m`;
};

export const createListItem = async (siteId: number | string, listId: number | string, payload: any): Promise<void> => {
  try {
    await axiosInstance.post(`/sites/${siteId}/lists/${listId}/items`, {
      ...payload
    })
  } catch (error: unknown) {
    console.error('Error in Creating Item:', error);
  }
}

export const updateListItem = async (siteId: number | string | string, listId: number | string, itemId: number | string, payload: any): Promise<void> => {
  try {
    await axiosInstance.patch(`/sites/${siteId}/lists/${listId}/items/${itemId}`, {
      ...payload
    })
  } catch (error: unknown) {
    console.error('Error in Creating Item:', error);
  }
}

export const getItems = async (siteId: number | string | null, listId: number | string, filter?: { field: string, item: string }[]) => {
  try {
    let filterQuery = '', itemResults: any = null;
    if (filter) {
      filter.map((e, i) => {
        filterQuery = filterQuery + `fields/${e.field} eq '${e.item}'`
        if (i !== filter.length - 1) filterQuery = filterQuery + ` and `
      })
      itemResults = await axiosInstance.get(`/sites/${siteId}/lists/${listId}/items?$expand=fields&$filter=${filterQuery}`)
      return { fields: itemResults?.data?.value || [] }
    } else {
      itemResults = await axiosInstance.get(`/sites/${siteId}/lists/${listId}/items?$expand=fields`)
      return { fields: itemResults?.data?.value || [] }
    }
  } catch (error: unknown) {
    console.error('Error in Getting Item:', error);
  }
}

export const uploadFile = async (siteId: number | string | null, listId: number | string, downloadURL: string) => {
  try {
    const fileResponse = await axios.get(downloadURL, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(fileResponse.data, 'binary');

    const contentDisposition = fileResponse.headers['content-disposition'];
    const fileName = contentDisposition
      ? contentDisposition.match(/filename="?([^"]+)"?/)?.[1] || 'uploaded-file'
      : path.basename(downloadURL.split('?')[0]);

    const listDriveRes = await axiosInstance.get(`/sites/${siteId}/lists/${listId}/drive`)
    const driveId = listDriveRes.data.id;
    if (!driveId) return null
    const uploadedFile = await axiosInstance.put(`/drives/${driveId}/root:/${fileName}:/content`, buffer)

    const listResponse = await axiosInstance.get(`/sites/${siteId}/lists/${listId}/items?$expand=driveItem`)
    const listItem = listResponse.data.value.find(
      (item: any) => item.driveItem && item.driveItem.id === uploadedFile.data.id
    );

    return {
      message: 'File uploaded to Document Library',
      fileName: uploadedFile.data.name,
      webUrl: uploadedFile.data.webUrl,
      id: uploadedFile.data.id,
      size: uploadedFile.data.size,
      listItem,
    };
  } catch (error: unknown) {
    throw error;
  }
};

export const getCV = async (siteId: number | string | null, listId: number | string, pageSize: number = 500, token: string | null, filter?: { field: string, item: string }[]) => {
  try {
    const topValue = Math.min(Number(pageSize), 500);
    let apiPath = `/sites/${siteId}/lists/${listId}/items?$expand=fields,driveItem&$top=${topValue}`;
    let filterQuery = ''
    if (token) {
      apiPath += `&$skiptoken=${encodeURIComponent(token)}`;
    }
    if (filter) {
      const allowedFilters = filter.filter(
        (f) => f.field !== "Candidate_Stage" && f.field !== "Communication_Skills"
      );
      if (allowedFilters.length) {
        console.log(allowedFilters, 'allouwed filters')
        filterQuery = allowedFilters
          .map((e) => `fields/${e.field} eq '${e.item}'`)
          .join(" and ");
        apiPath = `/sites/${siteId}/lists/${listId}/items?$expand=fields,driveItem&$top=${topValue}&$filter=${encodeURIComponent(filterQuery)}`;
      }
    }
    const itemsResult = await axiosInstance.get(apiPath);
    if (!itemsResult.data?.value?.length) {
      return null;
    }
    let nextSkipToken = null;
    if (itemsResult.data['@odata.nextLink']) {
      const url = new URL(itemsResult.data['@odata.nextLink']);
      nextSkipToken = url.searchParams.get('$skiptoken');
    }



    const filterMap = (filter || []).reduce((acc, { field, item }) => {
      acc[field] = acc[field] || [];
      acc[field].push(item);
      return acc;
    }, {} as Record<string, string[]>);

    const filteredItems = itemsResult.data.value
      .filter((item: any) => {
        if (!filter || !filter.length) return true;
        return Object.entries(filterMap).every(([field, filterValues]) => {
          if (field !== 'Candidate_Stage' && field !== 'Communication_Skills') {
            return true;
          }
          const fieldValue = item.fields[field];
          if (!fieldValue) return false;
          try {
            const parsedValue = JSON.parse(fieldValue) || [];
            return filterValues.some(value => parsedValue.includes(value));
          } catch (e) {
            console.warn(`Invalid JSON in ${field} for item ${item.id}:`, e);
            return false;
          }
        });
      })
      .slice(0, pageSize);


    return {
      items: filteredItems,
      nextSkipToken,
    }
  } catch (error: unknown) {
    console.error('Error fetching CVs:', error);
    throw error;
  }
};


export const getCandidates = async (
  siteId: number | string | null | string,
  listId: number | string,
  pageSize: number = 500,
  token: string | null,
  filter?: { field: string; item: string; isClient?: boolean }[]
) => {
  try {
    const topValue = Math.min(Number(pageSize), 500);
    let apiPath = `/sites/${siteId}/lists/${listId}/items?$expand=fields,driveItem&$top=${topValue}`;
    let filterQuery = '';

    if (token) {
      apiPath += `&$skiptoken=${encodeURIComponent(token)}`;
    }

    if (filter) {
      const allowedFilters = filter.filter((e) => !e.isClient);
      if (allowedFilters.length) {
        filterQuery = allowedFilters
          .map((e) => `fields/${e.field} eq '${e.item}'`)
          .join(' and ');
        apiPath += `&$filter=${encodeURIComponent(filterQuery)}`;
      }
    }

    const itemsResult = await axiosInstance.get(apiPath);
    if (!itemsResult.data?.value?.length) {
      return null;
    }

    let nextSkipToken = null;
    if (itemsResult.data['@odata.nextLink']) {
      const url = new URL(itemsResult.data['@odata.nextLink']);
      nextSkipToken = url.searchParams.get('$skiptoken');
    }

    let items = itemsResult.data.value;
    if (filter && filter.some((f) => f.isClient)) {
      items = itemsResult.data.value.filter((field: any) =>
      filter.every((f) => {
        if (f.isClient) {
        const parsedField = JSON.parse(field.fields[f.field] || '[]') as string[];
        return parsedField
          .map((v) => (typeof v === 'string' ? v.toLowerCase() : v))
          .includes(typeof f.item === 'string' ? f.item.toLowerCase() : f.item);
        }
        return true;
      })
      );
    }

    return {
      items,
      nextSkipToken,
    };
  } catch (error: unknown) {
    console.error('Error fetching CVs:', error);
    throw error;
  }
};

export const parseCVs = async (downloadURL: string, siteId: number | string, listId: number | string, itemId: number | string) => {
  try {
    const response = await axios.get(downloadURL, {
      responseType: 'arraybuffer',
    });
    const isPDF = downloadURL.toLowerCase().endsWith('.pdf') || response.headers['content-type'] === 'application/pdf';

    let extractedText = '';
    if (isPDF) {
      const loadingTask = pdfjsLib.getDocument({ data: response.data });
      const pdf = await loadingTask.promise;
      let textContent = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        textContent += content.items.map((item: any) => item.str).join(' ') + '\n';
      }
      extractedText = textContent;
    } else {
      const result = await mammoth.extractRawText({ buffer: response.data });
      extractedText = result.value;
    }

    const openRouterResponse = await axios.post(
      API_URL,
      {
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: extractedText }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const generatedText = openRouterResponse.data.choices?.[0]?.message?.content || '';
    const cleanedJson = generatedText.replace(/```json|```/g, '').trim();
    let parsedJson: any = {};
    try {
      parsedJson = JSON.parse(cleanedJson);
    } catch (e) {
      console.warn('Failed to parse JSON from LLM response:', e);
    }
    const rawTags = parsedJson.Tags || [];
    const tagsJson = JSON.stringify(rawTags);

    await updateListItem(siteId, listId, itemId, {
      fields: {
        tags: tagsJson,
      },
    });
return true
  } catch (error: unknown) {
    console.error('Error fetching CVs:', error);
    throw error;
  }
};

export const screenCv = async (downloadURL: string, siteId: number | string | string, listId: number | string, itemId: number, applied_position: string, job_description: string, prev_screenData: any, prev_screended_status: any) => {
  try {

    const response = await axios.get(downloadURL, {
      responseType: 'arraybuffer',
    });
    const isPDF = downloadURL.toLowerCase().endsWith('.pdf') || response.headers['content-type'] === 'application/pdf';

    let extractedText = '';
    if (isPDF) {
      const loadingTask = pdfjsLib.getDocument({ data: response.data });
      const pdf = await loadingTask.promise;
      let textContent = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        textContent += content.items.map((item: any) => item.str).join(' ') + '\n';
      }
      extractedText = textContent;
    } else {
      const result = await mammoth.extractRawText({ buffer: response.data });
      extractedText = result.value;
    }


    const system_prompt = generateResumeEvaluationPrompt(job_description, applied_position)
    const openRouterResponse = await axios.post(
      API_URL,
      {
        model: MODEL,
        messages: [
          { role: 'system', content: system_prompt },
          { role: 'user', content: extractedText }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const generatedText = openRouterResponse.data.choices?.[0]?.message?.content || '';
    const cleanedJson = generatedText.replace(/```json|```/g, '').trim();
    let screenedData, status

    if (!prev_screenData ||prev_screenData.length <= 0 ) {
      screenedData = JSON.stringify([{ screen_results: JSON.parse(cleanedJson), position: applied_position }])
      status = JSON.stringify([applied_position])
    } else {
      let data = prev_screenData || [];
      let statusData = prev_screended_status || [];
      let filteredData = data.filter((item: any) => item.position !== applied_position);
      screenedData = JSON.stringify([
        ...[{ screen_results: JSON.parse(cleanedJson), position: applied_position }],
        ...filteredData
      ]);
      statusData = statusData.filter((item: string) => item !== applied_position);
      statusData.push(applied_position);
      status = JSON.stringify(statusData);
    }

    await updateListItem(siteId, listId, itemId, {
      fields: {
        screen_results: screenedData,
        screen_status: status
      },
    })
    return { status: true }
  } catch (error: unknown) {
    console.error('Error fetching CVs:', error);
    throw error;
  }
};

export const deleteListItem = async (siteId: number | string, listId: number | string, itemId: number) => {
  try {
    await axiosInstance.delete(`/sites/${siteId}/lists/${listId}/items/${itemId}`);
  } catch (error: unknown) {
    console.error('Error deleting item:', error);
    throw error;
  }
};


export const uploadCVWithMetadata = async (
  siteId: number | string,
  listId: number | string,
  file: File,
  metadata: {
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    job_Title: string;
    campaign?: string;
    currentsalary?: string;
    expectedsalary?: string;
    yearofexperience?: string;
    city?: string;
    notes?: string;
    Communication_Skills: string | null
  }
) => {
  try {
    const listDriveRes = await axiosInstance.get(`/sites/${siteId}/lists/${listId}/drive`);
    const driveId = listDriveRes.data.id;

    const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
    const filename = `${nameWithoutExtension}-${metadata.job_Title}.pdf`;

    const uploadedFile = await axiosInstance.put(
      `/drives/${driveId}/root:/${filename}:/content`,
      file,
      {
        headers: {
          "Content-Type": file.type,
        },
      }
    );

    const uploadedFileId = uploadedFile.data.id;

    const listResponse = await axiosInstance.get(`/sites/${siteId}/lists/${listId}/items?$expand=driveItem`);
    const listItem = listResponse.data.value.find(
      (item: any) => item.driveItem?.id === uploadedFileId
    );

    if (!listItem?.id) {
      throw new Error("Uploaded file item not found in list.");
    }

    const itemId = listItem.id;

    const fields: Record<string, any> = {
      first_name: `${metadata.firstname}`,
      last_name: `${metadata.lastname}`,
      email: metadata.email,
      phone_number: metadata.phone,
      job_title: metadata.job_Title,
      current_salary: metadata.currentsalary,
      expected_salary: metadata.expectedsalary,
      years_of_experience: metadata.yearofexperience,
      city: metadata.city,
    };

    if (metadata.Communication_Skills) {
      fields.Communication_Skills = metadata.Communication_Skills;
    }
    Object.keys(fields).forEach(
      (key) => (fields[key] === '' || fields[key] === null || fields[key] === undefined) && delete fields[key]
    );

    await updateListItem(siteId, listId, itemId, { fields });


    return { itemId, uploadedFile: uploadedFile.data };
  } catch (error) {
    console.error("Error uploading CV with metadata:", error);
    throw error;
  }
};


export const uploadJobPostings = async (siteId: number | string, listId: number | string, payload: any) => {
  try {
    await axiosInstance.post(`/sites/${siteId}/lists/${listId}/items`, {
      ...payload
    })
  } catch (error) {
    console.error(error);
  }
}