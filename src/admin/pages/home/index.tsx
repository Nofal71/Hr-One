import { 
  Briefcase, 
  Users, 
  Calendar, 
  CheckCircle, 
  Plus, 
  Search, 
  Settings, 
  TrendingUp 
} from 'lucide-react';

const Home = () => {
  const statsData = [
    {
      title: 'Active Job Postings',
      value: '12',
      change: '+3 this month',
      icon: <Briefcase size={24} />,
      iconColor: '#4A90E2'
    },
    {
      title: 'Total Candidates',
      value: '247',
      change: '+15 this week',
      icon: <Users size={24} />,
      iconColor: '#7ED321'
    },
    {
      title: 'Interviews Scheduled',
      value: '8',
      change: 'This week',
      icon: <Calendar size={24} />,
      iconColor: '#F5A623'
    },
    {
      title: 'Positions Filled',
      value: '5',
      change: 'This month',
      icon: <CheckCircle size={24} />,
      iconColor: '#9013FE'
    }
  ];

  const quickActions = [
    {
      title: 'Post New Job',
      description: 'Create and publish a new job posting',
      icon: <Plus size={24} />,
      buttonColor: '#4A90E2'
    },
    {
      title: 'Review Candidates',
      description: 'Browse and manage candidate applications',
      icon: <Search size={24} />,
      buttonColor: '#7ED321'
    },
    {
      title: 'Platform Settings',
      description: 'Configure your HR portal preferences',
      icon: <Settings size={24} />,
      buttonColor: '#757575'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
        color: 'white',
        padding: '40px 40px',
        position: 'relative'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '600',
          margin: '0 0 8px 0',
          lineHeight: '1.2'
        }}>
          Welcome to TalentOne Portal
        </h1>
        <p style={{
          fontSize: '16px',
          margin: '0 0 24px 0',
          opacity: '0.9',
          lineHeight: '1.4'
        }}>
          Streamline your hiring process and manage candidates efficiently
        </p>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '12px'
          }}>
            <TrendingUp size={14} />
            <span>Growing Fast</span>
          </div>
          <div style={{
            backgroundColor: '#7ED321',
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '12px'
          }}>
            Active
          </div>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {statsData.map((stat, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div>
                  <div style={{
                    fontSize: '36px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '4px',
                    lineHeight: '1'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: '1.2'
                  }}>
                    {stat.change}
                  </div>
                </div>
                <div style={{
                  backgroundColor: stat.iconColor,
                  color: 'white',
                  padding: '12px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '48px',
                  minHeight: '48px'
                }}>
                  {stat.icon}
                </div>
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#333',
                lineHeight: '1.3'
              }}>
                {stat.title}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '24px',
          marginTop: '0'
        }}>
          Quick Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {quickActions.map((action, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <div style={{
                  backgroundColor: action.buttonColor,
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  marginRight: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {action.icon}
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#333',
                  margin: '0',
                  lineHeight: '1.3'
                }}>
                  {action.title}
                </h3>
              </div>
              <p style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '24px',
                lineHeight: '1.4',
                flexGrow: '1'
              }}>
                {action.description}
              </p>
              <button style={{
                backgroundColor: action.buttonColor,
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onMouseOver={(e) => ((e.target as HTMLButtonElement).style.opacity = '0.9')}
              onMouseOut={(e) => ((e.target as HTMLButtonElement).style.opacity = '1')}>
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '24px',
          marginTop: '0'
        }}>
          Recent Activity
        </h2>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <div style={{
              backgroundColor: '#4A90E2',
              color: 'white',
              padding: '10px',
              borderRadius: '50%',
              marginRight: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '40px',
              minHeight: '40px'
            }}>
              <Briefcase size={20} />
            </div>
            <div style={{ flexGrow: '1' }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#333',
                marginBottom: '4px',
                lineHeight: '1.3'
              }}>
                New job posting: Senior Frontend Developer
              </div>
              <div style={{
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.2'
              }}>
                2 hours ago
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;