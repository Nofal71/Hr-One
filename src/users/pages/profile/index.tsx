import { Card, CardFooter, CardHeader } from '@fluentui/react-components';
import { Button } from '@fluentui/react-components';
import { Badge } from '@fluentui/react-components';
import { Avatar } from '@fluentui/react-components';
import { User, Clock, Coffee, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  // Mock user data
  const user = {
    displayName: 'John Doe',
    mail: 'john.doe@company.com',
    department: 'Engineering',
    position: 'Senior Developer',
    employeeId: 'EMP001',
    joinDate: '2023-01-15',
    avatar: undefined
  };

  const stats = [
    { label: 'Hours Today', value: '7h 30m', icon: Clock },
    { label: 'Break Time', value: '45m', icon: Coffee },
    { label: 'Days This Month', value: '18', icon: Calendar }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: 16 }}>
      <div style={{ maxWidth: 1024, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/">
            <Button appearance="outline" size="small">
              <ArrowLeft style={{ height: 16, width: 16, marginRight: 8 }} />
              Back to Dashboard
            </Button>
          </Link>
          <h1 style={{ fontSize: 32, fontWeight: 700 }}>User Profile</h1>
        </div>

        {/* Profile Header Card */}
        <Card>
        <CardHeader
            image={
                <Avatar
                    name={user.displayName}
                    aria-label={user.displayName}
                    size={96}
                    color="colorful"
                    style={{ height: 96, width: 96, fontSize: 32 }}
                />
            }
            header={
                <div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{user.displayName}</h2>
                    <p style={{ color: '#4b5563', margin: 0 }}>{user.mail}</p>
                </div>
            }
            description={
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <Badge appearance="filled">{user.department}</Badge>
                    <Badge appearance="outline">{user.position}</Badge>
                    <Badge appearance="outline">ID: {user.employeeId}</Badge>
                </div>
            }
        />
        <CardFooter>
            <Button>
                <User style={{ height: 16, width: 16, marginRight: 8 }} />
                Edit Profile
            </Button>
        </CardFooter>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          {/* Stats Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              {stats.map((stat, index) => (
                <Card key={index}>
                <CardHeader
                    image={
                        <div style={{ padding: 8, backgroundColor: '#dbeafe', borderRadius: 8 }}>
                            <stat.icon style={{ height: 20, width: 20, color: '#2563eb' }} />
                        </div>
                    }
                    header={
                        <p style={{ fontSize: 14, color: '#4b5563', margin: 0 }}>{stat.label}</p>
                    }
                    description={
                        <p style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{stat.value}</p>
                    }
                />
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader
                header={<b>Recent Activity</b>}
              />
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #e5e7eb' }}>
                  <div>
                    <p style={{ fontWeight: 500, margin: 0 }}>Clocked In</p>
                    <p style={{ fontSize: 14, color: '#4b5563', margin: 0 }}>Started work day</p>
                  </div>
                  <Badge appearance="outline">9:00 AM</Badge>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid #e5e7eb' }}>
                  <div>
                    <p style={{ fontWeight: 500, margin: 0 }}>Break Started</p>
                    <p style={{ fontSize: 14, color: '#4b5563', margin: 0 }}>15-minute break</p>
                  </div>
                  <Badge appearance="outline">12:30 PM</Badge>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 500, margin: 0 }}>Break Ended</p>
                    <p style={{ fontSize: 14, color: '#4b5563', margin: 0 }}>Returned to work</p>
                  </div>
                  <Badge appearance="outline">12:45 PM</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Employee Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Card>
              <CardHeader
                header={<b>Employee Information</b>}
              />
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}></div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#4b5563' }}>Employee ID</p>
                  <p style={{ fontSize: 18 }}>{user.employeeId}</p>
                </div>
                
                {/* <Separator /> */}
                
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#4b5563' }}>Department</p>
                  <p style={{ fontSize: 18 }}>{user.department}</p>
                </div>
                
                {/* <Separator /> */}
                
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#4b5563' }}>Position</p>
                  <p style={{ fontSize: 18 }}>{user.position}</p>
                </div>
                
                {/* <Separator /> */}
                
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#4b5563' }}>Join Date</p>
                  <p style={{ fontSize: 18 }}>{user.joinDate}</p>
                </div>
              
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader
                header={<b>Quick Actions</b>}
              />
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Button appearance="outline" style={{ justifyContent: 'flex-start' }}>
                  <Calendar style={{ height: 16, width: 16, marginRight: 8 }} />
                  View Time Logs
                </Button>
                
                <Button appearance="outline" style={{ justifyContent: 'flex-start' }}>
                  <Coffee style={{ height: 16, width: 16, marginRight: 8 }} />
                  Break History
                </Button>
                
                <Button appearance="outline" style={{ justifyContent: 'flex-start' }}>
                  <User style={{ height: 16, width: 16, marginRight: 8 }} />
                  Update Settings
                </Button>
              </div>
            </Card>
            {/* </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;