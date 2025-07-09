import React, { useState, useEffect } from 'react';
// import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Body1, Caption1, Card, CardFooter, CardHeader, CardPreview } from '@fluentui/react-components';
import { Badge } from '@fluentui/react-components';
import { Button, Skeleton } from '@fluentui/react-components';
import { Megaphone, AlertTriangle, Calendar, User, ChevronRight } from 'lucide-react';
import { useStyles } from '../styles';

interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  priority: 'normal' | 'urgent';
  category: string;
}

interface NoticeBoardProps {
  theme: 'light' | 'dark';
}

const NoticeBoard: React.FC<NoticeBoardProps> = ({ theme }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNotice, setExpandedNotice] = useState<string | null>(null);
  const styles= useStyles();

  // Mock data - replace with actual API call
  const mockNotices: Notice[] = [
    {
      id: '1',
      title: 'Holiday Schedule Update',
      content: 'Please note that the office will be closed on December 25th and January 1st. All employees are requested to plan their work accordingly and ensure project deadlines are met before the holidays.',
      author: 'HR Department',
      date: '2024-12-20',
      priority: 'normal',
      category: 'Holiday'
    },
    {
      id: '2',
      title: 'Mandatory Security Training',
      content: 'All employees must complete the cybersecurity training module by December 31st, 2024. This is mandatory for compliance purposes.',
      author: 'IT Security',
      date: '2024-12-18',
      priority: 'urgent',
      category: 'Training'
    },
    {
      id: '3',
      title: 'New Employee Benefits Program',
      content: 'We are excited to announce our enhanced benefits program starting January 2025, including improved health coverage and flexible work arrangements.',
      author: 'HR Department',
      date: '2024-12-15',
      priority: 'normal',
      category: 'Benefits'
    },
    {
      id: '4',
      title: 'Office Renovation Notice',
      content: 'The 3rd floor will undergo renovation from January 15-30, 2025. Affected employees will be relocated temporarily.',
      author: 'Facilities',
      date: '2024-12-12',
      priority: 'normal',
      category: 'Facilities'
    },
    {
      id: '5',
      title: 'Performance Review Cycle',
      content: 'The annual performance review cycle begins January 5th, 2025. Please prepare your self-assessments and goals for the upcoming year.',
      author: 'HR Department',
      date: '2024-12-10',
      priority: 'urgent',
      category: 'HR'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchNotices = async () => {
      setLoading(true);
      try {
        // Replace this with actual API call to fetch notices
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNotices(mockNotices);
      } catch (error) {
        console.error('Error fetching notices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPriorityBadge = (priority: string) => {
    return priority === 'urgent' ? (
    <Badge
      appearance="filled"
      style={{
        // root: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        // },
      }}
    >
      <AlertTriangle style={{ height: 12, width: 12 }} />
      Urgent
    </Badge>
    ) : (
      <Badge appearance="tint">
        Notice
      </Badge>
    );
  };

  const toggleExpanded = (noticeId: string) => {
    setExpandedNotice(expandedNotice === noticeId ? null : noticeId);
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
    <Card style={{ width: '100%', height: '100%' }}>
      <CardHeader
        image={
        <Megaphone style={{ height: 20, width: 20, color: '#2563eb' }} />
        }
        header={
        <span style={{ fontWeight: 600 }}>Notice Board</span>
        }
      />
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Skeleton style={{ height: 16, width: '75%' }} />
            <Skeleton style={{ height: 12, width: '50%' }} />
            <Skeleton style={{ height: 12, width: '100%' }} />
          </div>
        ))}
        </div>
      </div>
    </Card>
    );
  }

  return (
    <Card style={{ width: '100%', height: '100%'}} className={styles.noticecard}>
      <CardHeader
        image={<Megaphone style={{ height: 24, width: 24, color: '#2563eb' }} />}
        header={<Body1 style={{fontSize:'20px'}}><b>Notice Board</b></Body1>}
      />

      <CardPreview>
        {/* Optionally, you can add a preview image or icon here */}
      </CardPreview>

      {notices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: '#6b7280' }}>
          <Megaphone style={{ height: 48, width: 48, display: 'block', margin: '0 auto 16px', color: '#9ca3af' }} />
          <Body1 as="p" style={{ fontWeight: 500 }}>No notices available</Body1>
          <Caption1>Check back later for updates</Caption1>
        </div>
      ) : (
        <div style={{ maxHeight: 384, overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
            {notices.map((notice) => (
              <Card
                key={notice.id}
                style={{
                  padding: 16,
                  borderRadius: 8,
                  border: '1px solid',
                  borderColor: notice.priority === 'urgent' ? '#fecaca' : '#e5e7eb',
                  background: notice.priority === 'urgent' ? '#fef2f2' : '#f9fafb',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  boxShadow: 'none',
                  ...(notice.priority === 'urgent'
                    ? { ':hover': { background: '#fee2e2' } }
                    : { ':hover': { background: '#f3f4f6' } }),
                }}
                onClick={() => toggleExpanded(notice.id)}
              >
                <CardHeader
                  header={
                    <Body1>
                      <b>{notice.title}</b>
                    </Body1>
                  }
                  description={
                    <Caption1>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <User style={{ height: 12, width: 12 }} />
                        {notice.author}
                        <Calendar style={{ height: 12, width: 12, marginLeft: 16 }} />
                        {formatDate(notice.date)}
                      </span>
                    </Caption1>
                  }
                  action={getPriorityBadge(notice.priority)}
                />
                <CardPreview>
                  <Body1 as="p" style={{ fontSize: 14, color: '#4b5563', marginBottom: 12, lineHeight: 1.6 }}>
                    {expandedNotice === notice.id
                      ? notice.content
                      : truncateText(notice.content)}
                  </Body1>
                </CardPreview>
                <CardFooter>
                  {notice.content.length > 100 && (
                    <Button
                      size="small"
                      icon={
                        <ChevronRight
                          style={{
                            height: 16,
                            width: 16,
                            transition: 'transform 0.2s',
                            transform: expandedNotice === notice.id ? 'rotate(90deg)' : undefined,
                          }}
                        />
                      }
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        toggleExpanded(notice.id);
                      }}
                    >
                      {expandedNotice === notice.id ? 'Show less' : 'Read more'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default NoticeBoard;