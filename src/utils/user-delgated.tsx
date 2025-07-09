import axiosInstance from "../axiosInstance";

const endPoint = 'http://localhost:3000/api'

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

export const createListItem = async (siteId: number, listId: number, payload: any): Promise<void> => {
  try {
    const api = endPoint + `/sharepoint/create-item`;
    await axiosInstance.post(api, {
      payload,
      siteId,
      listId,
    })
  } catch (error: unknown) {
    console.error('Error in Creating Item:', error);
  }
}

export const updateListItem = async (siteId: number, listId: number, itemId: number, payload: any): Promise<void> => {
  try {
    const api = endPoint + `/sharepoint/update-item`;
    await axiosInstance.patch(api, {
      payload,
      listId,
      siteId,
      itemId
    })
  } catch (error: unknown) {
    console.error('Error in Creating Item:', error);
  }
}

export const getUsersReport = async (
  siteName: string,
  listName: string,
  userMail: string,
  startDate?: string | null,
  endDate?: string | null
) => {
  try {
    const api = endPoint + `/sharepoint/user-reports`;
    const item = await axiosInstance.get(api, {
      params: {
        userMail,
        siteName,
        listName,
        filter: JSON.stringify({ startDate, endDate }),
      },
    });
    return item.data;
  } catch (error: unknown) {
    console.error('Error in Getting User Reports:', error);
  }
};

export const getItems = async (siteId: number | null, listId: number, filter?: { field: string, item: string }[]) => {
  try {
    const api = endPoint + `/sharepoint/get-item`;
    const item = await axiosInstance.get(api, {
      params: {
        siteId,
        listId,
        filter: filter ? JSON.stringify(filter) : undefined
      }
    })
    return item.data
  } catch (error: unknown) {
    console.error('Error in Creating Item:', error);
  }
}

export const uploadFile = async (siteId: number | null, listId: number, downloadURL: string) => {
  try {
    const api = endPoint + `/sharepoint/upload-item`;
    const item = await axiosInstance.get(api, {
      params: {
        siteId,
        listId,
        downloadURL
      },
    });
    return item.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getCV = async (siteId: number | null, listId: number, pageSize: number = 50, token: string | null) => {
  try {
    const api = `${endPoint}/sharepoint/get-cvs`;
    const item = await axiosInstance.get(api, {
      params: {
        siteId,
        listId,
        top: pageSize,
        ...(token && { skipToken: token }),
      },
    });
    return item.data;
  } catch (error: unknown) {
    console.error('Error fetching CVs:', error);
    throw error;
  }
};


export const parseCVs = async (downloadURL: string, siteId: number, listId: number, itemId: number) => {
  try {
    const api = endPoint + `/sharepoint/parse-cv`;
    const response = await axiosInstance.get(api, {
      params: {
        downloadURL,
        itemId,
      },
    });
    const itemID = response.data.itemId
    const rawTags = response.data?.data.Tags || [];
    const tagsJson = JSON.stringify(rawTags);

    await updateListItem(siteId, listId, itemID, {
      fields: {
        Tags: tagsJson,
        CandidateName: response.data.data.CandidateName,
      },
    });

  } catch (error: unknown) {
    console.error('Error fetching CVs:', error);
    throw error;
  }
};

export const screenCv = async (downloadURL: string, siteId: number, listId: number, itemId: number, applied_position: string, job_description: string, prev_screenData: any, prev_screended_status: any) => {
  try {
    const api = endPoint + `/sharepoint/screen-cv`;
    const response = await axiosInstance.get(api, {
      params: {
        downloadURL,
        itemId,
        applied_position,
        job_description,
      },
    });
    const itemID = response.data.itemId
    let screenedData, status

    if (prev_screenData === '' || !prev_screenData) {
      screenedData = JSON.stringify([{ screenedData: response.data.data, position: applied_position }])
      status = JSON.stringify([applied_position])
    } else {
      let data = JSON.parse(prev_screenData) || [];
      let statusData = prev_screended_status || [];
      let filteredData = data.filter((item: any) => item.position !== applied_position);
      screenedData = JSON.stringify([
        { screenedData: response.data.data, position: applied_position },
        ...filteredData
      ]);
      statusData = statusData.filter((item: string) => item !== applied_position);
      statusData.push(applied_position);
      status = JSON.stringify(statusData);
    }
    await updateListItem(siteId, listId, itemID, {
      fields: {
        screenedData: screenedData,
        screenStatus: status
      },
    })
    return response.data
  } catch (error: unknown) {
    console.error('Error fetching CVs:', error);
    throw error;
  }
};


export const deleteListItem = async (siteId: number, listId: number, itemId: number) => {
  try {
    const api = endPoint + `/sharepoint/delete-item`;
    await axiosInstance.delete(api, {
      params: {
        siteId,
        listId,
        itemId,
      },
    });
  } catch (error: unknown) {
    console.error('Error deleting item:', error);
    throw error;
  }
};
