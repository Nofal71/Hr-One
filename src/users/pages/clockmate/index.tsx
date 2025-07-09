import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Spinner,
  Text,
  FluentProvider,
  webLightTheme,
  webDarkTheme,
  Card,
  Caption1,
} from '@fluentui/react-components';
import { Clock12Filled, DrinkCoffeeRegular } from '@fluentui/react-icons';
import { useAuth } from '../../../context/AuthContext';
import { createListItem, updateListItem, calculateCurrentDuration, getItems } from '../../../utils';
import Header from './sub-components/header';
import { useStyles } from './styles';
import WorkCard from './sub-components/WorkCard';
import LiveClock from './sub-components/clock';
import { UserFields } from './types';
import { useSites } from '../../../context/SitesContext';
import NoticeBoard from './components/noticeboard';

interface BreakLogs {
  breakIn: string;
  breakOut: string;
}

interface ClockMateProps {
  theme: 'light' | 'dark';
}

const ClockMate: React.FC<ClockMateProps> = ({ theme }) => {
  const styles = useStyles();
  const [userClockedIn, setUserClockedIn] = useState<boolean>(false);
  const [userClockedOut, setUserClockedOut] = useState<boolean>(false);
  const [userInBreak, setUserInBreak] = useState<boolean>(false);
  const [currentDuration, setCurrentDuration] = useState<string | null>('0h 0m');
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<boolean>(false);
  const [breakProgress, setBreakProgress] = useState<boolean>(false);
  const [userListFields, setUserFields] = useState<UserFields | null>(null);

  const { user } = useAuth();
  const { getSiteIds } = useSites();
  const selectedTheme = theme === 'dark' ? webDarkTheme : webLightTheme;
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];

  const fetchSiteIds = useCallback(async () => {
    try {
      const data = await getSiteIds('HR Operations', ['Attendence Timeline']);
      return {
        siteId: data?.siteId,
        attendanceTimeLine: data?.lists[0],
      };
    } catch (error) {
      console.error('Error fetching site IDs:', error);
      return null;
    }
  }, [getSiteIds]);

  const initialFunc = useCallback(async (load: boolean = true): Promise<void> => {
    if (!user) return;
    load && setLoading(true);
    try {
      const siteData = await fetchSiteIds();
      if (!siteData || !siteData.attendanceTimeLine) return;

      const data: any = await getItems(siteData.siteId, siteData.attendanceTimeLine.id, [
        {
          field: 'Date',
          item: formattedDate,
        },
        {
          field: 'Email',
          item: user.mail,
        },
      ]);
      if (data) {
        setUserFields(data.fields?.[0].fields);
      }
      if (data?.fields?.[0]?.fields?.BreaksLog) {
        const parsedBreakLogs = JSON.parse(data.fields[0].fields.BreaksLog);
        setUserInBreak(parsedBreakLogs.some((e: BreakLogs) => !e.breakOut));
      }
    } catch (error: unknown) {
      console.error('Error fetching user clock data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, fetchSiteIds, formattedDate]);

  const fetchListItems = useCallback(async () => {
    if (!user) return;
    const siteData = await fetchSiteIds();
    if (!siteData || !siteData.attendanceTimeLine) return;

    const item: any = await getItems(siteData.siteId, siteData.attendanceTimeLine.id, [
      {
        field: 'Date',
        item: formattedDate,
      },
      {
        field: 'Email',
        item: user.mail,
      },
    ]);
    return item;
  }, [user, fetchSiteIds, formattedDate]);

  const clockIn = useCallback(async () => {
    setProgress(true);
    if (!user) return;
    try {
      const siteData = await fetchSiteIds();
      if (!siteData || !siteData.attendanceTimeLine) return;

      await createListItem(siteData.siteId, siteData.attendanceTimeLine.id, {
        fields: {
          Title: user.displayName,
          Email: user.mail,
          Date: formattedDate,
          Clockin: new Date().toISOString(),
          Clockout: null,
          BreaksLog: null,
        },
      });
      setUserClockedIn(true);
      initialFunc(false);
    } catch (error) {
      console.error(error);
    }
    setProgress(false);
  }, [user, fetchSiteIds, initialFunc, formattedDate]);

  const clockOut = useCallback(async () => {
    if (!user) return;
    setProgress(true);
    try {
      const item = await fetchListItems();
      const siteData = await fetchSiteIds();
      if (!siteData || !siteData.attendanceTimeLine || !item) return;

      const breakLogs = item?.fields?.[0]?.fields?.BreaksLog || null;
      let totalDuration = 0;
      if (breakLogs) {
        const parsedBreakLogs = JSON.parse(breakLogs);
        parsedBreakLogs.forEach((e: any) => {
          if (e.duration) {
            const [hours, minutes] = e.duration.split('hrs ');
            totalDuration += parseInt(hours) * 60 + parseInt(minutes);
          }
        });
      }
      await updateListItem(siteData.siteId, siteData.attendanceTimeLine.id, item?.fields?.[0]?.id, {
        fields: {
          Clockout: new Date().toISOString(),
          BreakDuration: totalDuration.toString(),
        },
      });
      setUserClockedOut(true);
      initialFunc(false);
    } catch (error) {
      console.error(error);
    }
    setProgress(false);
  }, [user, fetchListItems, fetchSiteIds, initialFunc]);

  const breakIn = useCallback(async () => {
    setBreakProgress(true);
    if (!user) return;
    try {
      const item = await fetchListItems();
      const siteData = await fetchSiteIds();
      if (!siteData || !siteData.attendanceTimeLine || !item) return;

      const breakLogs = item?.fields?.[0]?.fields?.BreaksLog || null;
      let newBreakLog = [{ breakIn: new Date().toISOString(), breakOut: null, duration: null }];
      if (breakLogs) {
        let parsedBreakLogs = JSON.parse(breakLogs);
        const isInBreak = parsedBreakLogs.some((e: any) => !e.breakOut);
        if (isInBreak) {
          setUserInBreak(true);
          return;
        } else {
          const updatedParsedBreak = [...parsedBreakLogs, { breakIn: new Date().toISOString(), breakOut: null, duration: null }];
          await updateListItem(siteData.siteId, siteData.attendanceTimeLine.id, item?.fields?.[0]?.id, {
            fields: {
              BreaksLog: JSON.stringify(updatedParsedBreak),
            },
          });
        }
        setUserInBreak(true);
        initialFunc(false);
        return;
      }
      await updateListItem(siteData.siteId, siteData.attendanceTimeLine.id, item?.fields?.[0]?.id, {
        fields: {
          BreaksLog: JSON.stringify(newBreakLog),
        },
      });
      setUserInBreak(true);
      initialFunc(false);
    } catch (error) {
      console.error(error);
    }
    setBreakProgress(false);
  }, [user, fetchListItems, fetchSiteIds, initialFunc]);

  const breakOut = useCallback(async () => {
    if (!user) return;
    setBreakProgress(true);
    try {
      const item = await fetchListItems();
      const siteData = await fetchSiteIds();
      if (!siteData || !siteData.attendanceTimeLine || !item) return;

      const breakLogs = item?.fields?.[0]?.fields?.BreaksLog || null;

      if (breakLogs) {
        let parsedBreakLogs = JSON.parse(breakLogs);
        let updatedParsedBreak = parsedBreakLogs[parsedBreakLogs.length - 1];

        const breakOutISO = new Date().toISOString();
        const breakIn = new Date(updatedParsedBreak.breakIn);
        const breakOut = new Date(breakOutISO);

        const durationMs = breakOut.getTime() - breakIn.getTime();
        const totalMinutes = Math.floor(durationMs / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        updatedParsedBreak.breakOut = breakOutISO;
        updatedParsedBreak.duration = `${hours}hrs ${minutes}mins`;
        parsedBreakLogs[parsedBreakLogs.length - 1] = updatedParsedBreak;

        await updateListItem(siteData.siteId, siteData.attendanceTimeLine.id, item?.fields?.[0]?.id, {
          fields: {
            BreaksLog: JSON.stringify(parsedBreakLogs),
          },
        });
      }

      setUserInBreak(false);
      initialFunc(false);
    } catch (error) {
      console.error(error);
    }
    setBreakProgress(false);
  }, [user, fetchListItems, fetchSiteIds, initialFunc]);

  useEffect(() => {
    initialFunc();
  }, [initialFunc]);

  useEffect(() => {
    if (userListFields?.Clockin) {
      setUserClockedIn(true);
    }
    if (userListFields?.Clockout) {
      setUserClockedOut(true);
    }
    setCurrentDuration(calculateCurrentDuration(userListFields?.Clockin));
  }, [userListFields]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f3f4f6' }}>
        <Spinner size="extra-large" label="Loading ClockMate..." />
      </div>
    );
  }

  return (
    <FluentProvider theme={selectedTheme}>
      <div className={styles.mainGrid}>
        <div className={styles.columnOne}>
          <Header userName={user?.displayName || 'User'} />
          <Card className={styles.card}>
            <div className={styles.durationContainer}>
              <Text className={styles.durationText}>
                {!userClockedOut ? currentDuration : userListFields?.Duration || '0h 0m'}
              </Text>
              <Caption1>Today's Hours</Caption1>
              <div
                style={{
                  height: 8,
                  backgroundColor: '#f3f4f6',
                  borderRadius: 9999,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    backgroundColor: '#FFD600',
                    width: '60%',
                  }}
                ></div>
              </div>
            </div>

            <div className={styles.buttonContainer}>
              {!userClockedIn ? (
                <Button className={styles.clockButton} appearance="primary" onClick={clockIn} icon={progress ? <Spinner size="extra-tiny" /> : <Clock12Filled />}>
                  Clock In
                </Button>
              ) : (
                <Button className={styles.clockButton} appearance={userClockedOut ? "subtle" : "primary"} onClick={clockOut} disabled={userClockedOut} icon={progress ? <Spinner size="extra-tiny" /> : <Clock12Filled />}>
                  Clock Out
                </Button>
              )}

              {userInBreak ? (
                <Button className={styles.breakButton} onClick={breakOut} disabled={userClockedOut || !userClockedIn} icon={breakProgress ? <Spinner size="extra-tiny" /> : <DrinkCoffeeRegular />}>
                  End Break
                </Button>
              ) : (
                <Button className={styles.breakButton} onClick={breakIn} disabled={userClockedOut || !userClockedIn} icon={breakProgress ? <Spinner size="extra-tiny" /> : <DrinkCoffeeRegular />}>
                  Start Break
                </Button>
              )}
            </div>
          </Card>
        </div>

        <div className={styles.columnTwo}>
          <LiveClock />
          <WorkCard
            title="Today's Activity"
            startTime={userListFields?.Clockin ? formatTime(userListFields.Clockin as string) : null}
            endTime={userListFields?.Clockout ? formatTime(userListFields.Clockout as string) : null}
            duration={currentDuration}
            theme={theme}
          />
        </div>

        <div className={styles.columnThree}>
          <NoticeBoard theme={theme} />
        </div>
      </div>
    </FluentProvider>
  );
};

export default ClockMate;