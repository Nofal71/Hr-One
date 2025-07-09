import React, { useState } from 'react';
import { Card, createMotionComponent } from '@fluentui/react-components';
import { Clock } from 'lucide-react';
import { useStyles } from '../styles';
interface HeaderProps {
    userName: string;
}
const BounceMotion = createMotionComponent({
    keyframes: [
        { transform: "translateX(0%)" },
        { transform: "translateX(30%)" },
        { transform: "translateX(0%)" },
    ],
    duration: 1000,
    iterations: Infinity,
    reducedMotion: {
        iterations: 1,
    },
});

const Header: React.FC<HeaderProps> = ({ userName }) => {
    const [isHovered, setIsHovered] = useState(false);
    const styles = useStyles();

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <Card
            style={{
                transition: 'all 300ms ease',
                boxShadow: isHovered ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}
            className={styles.card}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={styles.header}>
                {isHovered ? (
                    <BounceMotion>
                        <div className={styles.iconWrapper}>
                            <Clock className={styles.icon} />
                        </div>
                    </BounceMotion>
                ) : (
                    <div className={styles.iconWrapper}>
                        <Clock className={styles.icon} />
                    </div>
                )}
                <div className={styles.headerTextContainer}>
                    <h2 className={styles.greeting}>{getGreeting()}, {userName}</h2>
                    <h1 className={styles.heading}>Let's get to work!</h1>
                </div>
                {/* <div className={styles.buttonWrapper}>
                    <div className={styles.clockInButton}>Clock in</div>
                </div> */}
            </div>
        </Card>
    );
};

export default Header;
