import React, { useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationDemo = () => {
  const { addNotification, businessNotifications } = useNotifications();

  useEffect(() => {
    // Demo notifications to showcase the system - run only once
    const demoNotifications = [
      // High-priority lead notification (critical)
      () => addNotification(businessNotifications.highPriorityLead({
        company_name: 'Tesla Fleet Services',
        score: 92,
        estimated_value: 750000
      })),
      
      // Quote approval needed (high priority)
      () => addNotification(businessNotifications.quoteApprovalNeeded({
        project: 'Walmart Fleet Charging Phase 2',
        value: '$1.2M'
      })),
      
      // New lead captured (medium priority)
      () => addNotification(businessNotifications.newLeadCaptured({
        company_name: 'Ford Motor Company',
        industry: 'Automotive Manufacturing'
      })),
      
      // AI pricing complete (low priority)
      () => addNotification(businessNotifications.aiPricingComplete({
        recommended_price: 68500,
        confidence_level: 0.94
      })),
      
      // Pipeline update (medium priority)
      () => addNotification(businessNotifications.pipelineUpdate(350000)),
      
      // Quote expiring (high priority)
      () => addNotification(businessNotifications.quoteExpiring({
        project: 'City Transit Hub Installation',
        deadline: 'Sep 30, 2025'
      })),
      
      // Follow-up reminder (medium priority)
      () => addNotification(businessNotifications.followUpReminder({
        company_name: 'Amazon Logistics'
      }))
    ];

    // Trigger notifications with delays to show different types
    const timeouts = [];
    
    // Immediate critical notification
    timeouts.push(setTimeout(demoNotifications[0], 1000));
    
    // High priority after 3 seconds
    timeouts.push(setTimeout(demoNotifications[1], 3000));
    
    // Medium priority notifications
    timeouts.push(setTimeout(demoNotifications[2], 5000));
    timeouts.push(setTimeout(demoNotifications[4], 7000));
    timeouts.push(setTimeout(demoNotifications[6], 9000));
    
    // Low priority notification
    timeouts.push(setTimeout(demoNotifications[3], 11000));
    
    // Another high priority
    timeouts.push(setTimeout(demoNotifications[5], 13000));

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []); // Empty dependency array to run only once

  return null; // This component doesn't render anything
};

export default NotificationDemo;