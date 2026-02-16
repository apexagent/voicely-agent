export interface Integration {
  name: string;
  icon: string;
  category: 'crm' | 'scheduling' | 'communication' | 'payment' | 'analytics' | 'documentation' | 'marketing' | 'compliance';
  action: string;
}

export interface IndustryWorkflowTemplate {
  industry: string;
  integrations: Integration[];
  conversationFlow: ConversationNode[];
}

export interface ConversationNode {
  id: string;
  type: 'agent' | 'user' | 'integration' | 'decision' | 'end';
  agentScript?: string;
  userResponse?: string;
  integrationAction?: string;
  integrationName?: string;
  conditions?: { condition: string; nextNodeId: string }[];
  nextNodeId?: string;
}

export const industryIntegrations: Record<string, Integration[]> = {
  medical: [
    { name: 'Epic EHR', icon: 'medical', category: 'crm', action: 'Access patient records and medical history' },
    { name: 'Cerner Health', icon: 'medical', category: 'crm', action: 'Update patient charts and notes' },
    { name: 'Athenahealth', icon: 'medical', category: 'scheduling', action: 'Schedule and manage appointments' },
    { name: 'DrChrono', icon: 'medical', category: 'documentation', action: 'Document visit notes and prescriptions' },
    { name: 'Zocdoc', icon: 'calendar', category: 'scheduling', action: 'Sync availability with online booking' },
    { name: 'Phreesia', icon: 'forms', category: 'documentation', action: 'Send patient intake forms' },
    { name: 'Twilio', icon: 'sms', category: 'communication', action: 'Send appointment reminders via SMS' },
    { name: 'Stripe', icon: 'payment', category: 'payment', action: 'Process copays and payments' },
    { name: 'HIPAA Vault', icon: 'compliance', category: 'compliance', action: 'Ensure HIPAA-compliant data handling' },
    { name: 'Practice Fusion', icon: 'medical', category: 'crm', action: 'Manage prescriptions and lab orders' },
  ],
  dental: [
    { name: 'Dentrix', icon: 'dental', category: 'crm', action: 'Access patient dental records and treatment history' },
    { name: 'Eaglesoft', icon: 'dental', category: 'crm', action: 'Manage patient charts and x-rays' },
    { name: 'Open Dental', icon: 'dental', category: 'scheduling', action: 'Schedule hygiene and procedure appointments' },
    { name: 'Curve Dental', icon: 'dental', category: 'crm', action: 'Cloud-based practice management' },
    { name: 'Dentally', icon: 'dental', category: 'scheduling', action: 'Online booking and patient portal' },
    { name: 'RevenueWell', icon: 'marketing', category: 'marketing', action: 'Automated patient recall campaigns' },
    { name: 'Weave', icon: 'communication', category: 'communication', action: 'Two-way texting with patients' },
    { name: 'CareCredit', icon: 'payment', category: 'payment', action: 'Process financing applications' },
    { name: 'Dental Intel', icon: 'analytics', category: 'analytics', action: 'Track production and case acceptance' },
    { name: 'Pearl AI', icon: 'ai', category: 'analytics', action: 'AI-powered x-ray analysis' },
  ],
  hotel: [
    { name: 'Opera PMS', icon: 'hotel', category: 'crm', action: 'Access guest profiles and reservation details' },
    { name: 'Cloudbeds', icon: 'hotel', category: 'crm', action: 'Manage room inventory and rates' },
    { name: 'Booking.com', icon: 'booking', category: 'scheduling', action: 'Sync availability across channels' },
    { name: 'Expedia Partner', icon: 'booking', category: 'scheduling', action: 'Update OTA listings and rates' },
    { name: 'Guestline', icon: 'hotel', category: 'crm', action: 'Property management and distribution' },
    { name: 'Revinate', icon: 'marketing', category: 'marketing', action: 'Guest feedback and reputation management' },
    { name: 'Alice', icon: 'concierge', category: 'communication', action: 'Concierge and operations platform' },
    { name: 'Stripe', icon: 'payment', category: 'payment', action: 'Process deposits and payments' },
    { name: 'Duetto', icon: 'analytics', category: 'analytics', action: 'Revenue optimization and forecasting' },
    { name: 'Canary Technologies', icon: 'hotel', category: 'documentation', action: 'Digital check-in and contracts' },
  ],
  veterinary: [
    { name: 'Vetspire', icon: 'vet', category: 'crm', action: 'Access pet medical records and history' },
    { name: 'eVetPractice', icon: 'vet', category: 'crm', action: 'Manage patient files and prescriptions' },
    { name: 'Cornerstone', icon: 'vet', category: 'crm', action: 'Comprehensive practice management' },
    { name: 'PetDesk', icon: 'scheduling', category: 'scheduling', action: 'Online booking and reminders' },
    { name: 'Vetsource', icon: 'pharmacy', category: 'crm', action: 'Prescription management and fulfillment' },
    { name: 'Digitail', icon: 'vet', category: 'crm', action: 'Cloud veterinary software' },
    { name: 'Twilio', icon: 'sms', category: 'communication', action: 'Send vaccination reminders' },
    { name: 'Stripe', icon: 'payment', category: 'payment', action: 'Process payments and deposits' },
    { name: 'Antech Diagnostics', icon: 'lab', category: 'documentation', action: 'Order and receive lab results' },
    { name: 'VetSuccess', icon: 'analytics', category: 'analytics', action: 'Practice analytics and benchmarking' },
  ],
  legal: [
    { name: 'Clio', icon: 'legal', category: 'crm', action: 'Manage cases and client matters' },
    { name: 'MyCase', icon: 'legal', category: 'crm', action: 'Case management and billing' },
    { name: 'PracticePanther', icon: 'legal', category: 'crm', action: 'Legal practice management' },
    { name: 'Calendly', icon: 'calendar', category: 'scheduling', action: 'Schedule consultations' },
    { name: 'DocuSign', icon: 'document', category: 'documentation', action: 'Send and track legal documents' },
    { name: 'LawPay', icon: 'payment', category: 'payment', action: 'Process retainers and trust payments' },
    { name: 'Lawmatics', icon: 'marketing', category: 'marketing', action: 'Intake automation and CRM' },
    { name: 'NetDocuments', icon: 'document', category: 'documentation', action: 'Document management system' },
    { name: 'Smokeball', icon: 'legal', category: 'crm', action: 'Automatic time tracking' },
    { name: 'Zoom', icon: 'video', category: 'communication', action: 'Schedule video consultations' },
  ],
  realestate: [
    { name: 'Follow Up Boss', icon: 'crm', category: 'crm', action: 'Manage leads and client relationships' },
    { name: 'kvCORE', icon: 'realestate', category: 'crm', action: 'Real estate platform and IDX' },
    { name: 'BoomTown', icon: 'realestate', category: 'crm', action: 'Lead generation and management' },
    { name: 'Showingtime', icon: 'scheduling', category: 'scheduling', action: 'Schedule property showings' },
    { name: 'Zillow Premier', icon: 'realestate', category: 'marketing', action: 'Sync listings and leads' },
    { name: 'DocuSign', icon: 'document', category: 'documentation', action: 'Send contracts and disclosures' },
    { name: 'Dotloop', icon: 'document', category: 'documentation', action: 'Transaction management' },
    { name: 'Calendly', icon: 'calendar', category: 'scheduling', action: 'Schedule consultations' },
    { name: 'Mailchimp', icon: 'email', category: 'marketing', action: 'Drip campaigns and newsletters' },
    { name: 'Google Calendar', icon: 'calendar', category: 'scheduling', action: 'Sync showing appointments' },
  ],
  restaurant: [
    { name: 'OpenTable', icon: 'restaurant', category: 'scheduling', action: 'Manage reservations and waitlist' },
    { name: 'Resy', icon: 'restaurant', category: 'scheduling', action: 'Handle bookings and VIP guests' },
    { name: 'Toast POS', icon: 'pos', category: 'crm', action: 'Access order history and preferences' },
    { name: 'Square', icon: 'payment', category: 'payment', action: 'Process payments and gift cards' },
    { name: 'SevenRooms', icon: 'restaurant', category: 'crm', action: 'Guest management and marketing' },
    { name: 'Yelp', icon: 'reviews', category: 'marketing', action: 'Sync reservation availability' },
    { name: 'DoorDash Drive', icon: 'delivery', category: 'crm', action: 'Coordinate delivery orders' },
    { name: 'Twilio', icon: 'sms', category: 'communication', action: 'Send reservation confirmations' },
    { name: 'MarketMan', icon: 'inventory', category: 'crm', action: 'Check inventory for specials' },
    { name: 'Lightspeed', icon: 'pos', category: 'crm', action: 'Restaurant management platform' },
  ],
  insurance: [
    { name: 'Salesforce Financial', icon: 'crm', category: 'crm', action: 'Manage policyholder relationships' },
    { name: 'Applied Epic', icon: 'insurance', category: 'crm', action: 'Agency management system' },
    { name: 'HawkSoft', icon: 'insurance', category: 'crm', action: 'Policy and client management' },
    { name: 'Vertafore', icon: 'insurance', category: 'crm', action: 'Insurance software solutions' },
    { name: 'EZLynx', icon: 'insurance', category: 'crm', action: 'Rating and management platform' },
    { name: 'Calendly', icon: 'calendar', category: 'scheduling', action: 'Schedule policy reviews' },
    { name: 'DocuSign', icon: 'document', category: 'documentation', action: 'Send policy documents for signature' },
    { name: 'Twilio', icon: 'sms', category: 'communication', action: 'Send premium reminders' },
    { name: 'Stripe', icon: 'payment', category: 'payment', action: 'Process premium payments' },
    { name: 'Agency Zoom', icon: 'marketing', category: 'marketing', action: 'Automated follow-ups and renewals' },
  ],
  fitness: [
    { name: 'Mindbody', icon: 'fitness', category: 'scheduling', action: 'Class booking and memberships' },
    { name: 'ClassPass', icon: 'fitness', category: 'scheduling', action: 'Sync availability with marketplace' },
    { name: 'Zen Planner', icon: 'fitness', category: 'crm', action: 'Member management and billing' },
    { name: 'Glofox', icon: 'fitness', category: 'crm', action: 'Gym management platform' },
    { name: 'Stripe', icon: 'payment', category: 'payment', action: 'Process memberships and packages' },
    { name: 'Twilio', icon: 'sms', category: 'communication', action: 'Send class reminders' },
    { name: 'Trainerize', icon: 'fitness', category: 'crm', action: 'Personal training platform' },
    { name: 'WellnessLiving', icon: 'fitness', category: 'crm', action: 'All-in-one business management' },
    { name: 'ABC Fitness', icon: 'fitness', category: 'crm', action: 'Member engagement platform' },
    { name: 'Mailchimp', icon: 'email', category: 'marketing', action: 'Member newsletters and promos' },
  ],
  automotive: [
    { name: 'DealerSocket', icon: 'auto', category: 'crm', action: 'Manage leads and customer profiles' },
    { name: 'VinSolutions', icon: 'auto', category: 'crm', action: 'Automotive CRM and desking' },
    { name: 'CDK Global', icon: 'auto', category: 'crm', action: 'Dealer management system' },
    { name: 'Shop-Ware', icon: 'auto', category: 'crm', action: 'Auto repair shop management' },
    { name: 'Mitchell 1', icon: 'auto', category: 'crm', action: 'Service and repair information' },
    { name: 'Calendly', icon: 'calendar', category: 'scheduling', action: 'Schedule test drives and service' },
    { name: 'Tekmetric', icon: 'auto', category: 'crm', action: 'Shop management software' },
    { name: 'Stripe', icon: 'payment', category: 'payment', action: 'Process deposits and payments' },
    { name: 'Twilio', icon: 'sms', category: 'communication', action: 'Service ready notifications' },
    { name: 'CarFax', icon: 'auto', category: 'documentation', action: 'Vehicle history reports' },
  ],
  spa: [
    { name: 'Booker', icon: 'spa', category: 'scheduling', action: 'Appointment booking and POS' },
    { name: 'Vagaro', icon: 'spa', category: 'scheduling', action: 'Salon and spa management' },
    { name: 'Boulevard', icon: 'spa', category: 'crm', action: 'Client experience platform' },
    { name: 'Mangomint', icon: 'spa', category: 'crm', action: 'Modern salon software' },
    { name: 'Square Appointments', icon: 'calendar', category: 'scheduling', action: 'Booking and payments' },
    { name: 'Twilio', icon: 'sms', category: 'communication', action: 'Appointment reminders' },
    { name: 'Stripe', icon: 'payment', category: 'payment', action: 'Process deposits and tips' },
    { name: 'Mailchimp', icon: 'email', category: 'marketing', action: 'Promotional campaigns' },
    { name: 'Fresha', icon: 'spa', category: 'scheduling', action: 'Free booking software' },
    { name: 'GiftUp', icon: 'payment', category: 'payment', action: 'Gift card management' },
  ],
  education: [
    { name: 'PowerSchool', icon: 'education', category: 'crm', action: 'Student information system' },
    { name: 'Blackboard', icon: 'education', category: 'crm', action: 'Learning management system' },
    { name: 'Canvas LMS', icon: 'education', category: 'crm', action: 'Course management platform' },
    { name: 'Slate CRM', icon: 'education', category: 'crm', action: 'Admissions and enrollment' },
    { name: 'Calendly', icon: 'calendar', category: 'scheduling', action: 'Schedule campus tours and meetings' },
    { name: 'Zoom', icon: 'video', category: 'communication', action: 'Virtual info sessions' },
    { name: 'Twilio', icon: 'sms', category: 'communication', action: 'Application status updates' },
    { name: 'Stripe', icon: 'payment', category: 'payment', action: 'Process application fees' },
    { name: 'Ellucian', icon: 'education', category: 'crm', action: 'Higher education ERP' },
    { name: 'Hubspot', icon: 'marketing', category: 'marketing', action: 'Enrollment marketing automation' },
  ],
  construction: [
    { name: 'Procore', icon: 'construction', category: 'crm', action: 'Project management platform' },
    { name: 'Buildertrend', icon: 'construction', category: 'crm', action: 'Construction project management' },
    { name: 'CoConstruct', icon: 'construction', category: 'crm', action: 'Custom builder software' },
    { name: 'JobNimbus', icon: 'construction', category: 'crm', action: 'Contractor CRM and project tracking' },
    { name: 'Calendly', icon: 'calendar', category: 'scheduling', action: 'Schedule estimates and consultations' },
    { name: 'DocuSign', icon: 'document', category: 'documentation', action: 'Send contracts and change orders' },
    { name: 'Stripe', icon: 'payment', category: 'payment', action: 'Process deposits and progress payments' },
    { name: 'Twilio', icon: 'sms', category: 'communication', action: 'Project update notifications' },
    { name: 'CompanyCam', icon: 'documentation', category: 'documentation', action: 'Photo documentation' },
    { name: 'Joist', icon: 'construction', category: 'documentation', action: 'Estimates and invoicing' },
  ],
  property: [
    { name: 'AppFolio', icon: 'property', category: 'crm', action: 'Property management software' },
    { name: 'Buildium', icon: 'property', category: 'crm', action: 'Rental property management' },
    { name: 'Rent Manager', icon: 'property', category: 'crm', action: 'Property accounting and operations' },
    { name: 'Yardi', icon: 'property', category: 'crm', action: 'Real estate investment management' },
    { name: 'Calendly', icon: 'calendar', category: 'scheduling', action: 'Schedule property tours' },
    { name: 'DocuSign', icon: 'document', category: 'documentation', action: 'Send lease agreements' },
    { name: 'Stripe', icon: 'payment', category: 'payment', action: 'Collect rent and deposits' },
    { name: 'Twilio', icon: 'sms', category: 'communication', action: 'Maintenance update notifications' },
    { name: 'Propertyware', icon: 'property', category: 'crm', action: 'Single-family property management' },
    { name: 'TenantCloud', icon: 'property', category: 'crm', action: 'Landlord software' },
  ],
  travel: [
    { name: 'Sabre', icon: 'travel', category: 'crm', action: 'Global distribution system' },
    { name: 'Amadeus', icon: 'travel', category: 'crm', action: 'Travel technology platform' },
    { name: 'TripAdvisor', icon: 'travel', category: 'marketing', action: 'Reviews and booking integration' },
    { name: 'Viator', icon: 'travel', category: 'scheduling', action: 'Tour and activity booking' },
    { name: 'Calendly', icon: 'calendar', category: 'scheduling', action: 'Schedule travel consultations' },
    { name: 'Stripe', icon: 'payment', category: 'payment', action: 'Process bookings and deposits' },
    { name: 'Twilio', icon: 'sms', category: 'communication', action: 'Itinerary and flight updates' },
    { name: 'Mailchimp', icon: 'email', category: 'marketing', action: 'Travel deals and newsletters' },
    { name: 'TravelPerk', icon: 'travel', category: 'crm', action: 'Business travel management' },
    { name: 'Rezdy', icon: 'travel', category: 'scheduling', action: 'Tour operator software' },
  ],
  wealth: [
    { name: 'Salesforce Financial', icon: 'finance', category: 'crm', action: 'Client relationship management' },
    { name: 'Wealthbox', icon: 'finance', category: 'crm', action: 'Financial advisor CRM' },
    { name: 'Redtail CRM', icon: 'finance', category: 'crm', action: 'Wealth management CRM' },
    { name: 'Orion', icon: 'finance', category: 'analytics', action: 'Portfolio management and reporting' },
    { name: 'Riskalyze', icon: 'finance', category: 'analytics', action: 'Risk assessment tools' },
    { name: 'Calendly', icon: 'calendar', category: 'scheduling', action: 'Schedule portfolio reviews' },
    { name: 'DocuSign', icon: 'document', category: 'documentation', action: 'Send account documents' },
    { name: 'Zoom', icon: 'video', category: 'communication', action: 'Virtual client meetings' },
    { name: 'MoneyGuidePro', icon: 'finance', category: 'analytics', action: 'Financial planning software' },
    { name: 'Advyzon', icon: 'finance', category: 'crm', action: 'All-in-one wealth platform' },
  ],
};

export type WorkflowType = 'consultation' | 'followup' | 'emergency';

export function generateDetailedConversationFlow(
  businessName: string,
  industry: string,
  services: string[],
  workflowType: WorkflowType = 'consultation'
): ConversationNode[] {
  const integrations = industryIntegrations[industry] || industryIntegrations.medical;
  const schedulingIntegration = integrations.find(i => i.category === 'scheduling');
  const crmIntegration = integrations.find(i => i.category === 'crm');
  const paymentIntegration = integrations.find(i => i.category === 'payment');
  const communicationIntegration = integrations.find(i => i.category === 'communication');

  if (workflowType === 'followup') {
    return generateFollowUpFlow(businessName, industry, services, integrations, crmIntegration, communicationIntegration);
  }
  
  if (workflowType === 'emergency') {
    return generateEmergencyFlow(businessName, industry, services, integrations, crmIntegration, communicationIntegration);
  }

  const flow: ConversationNode[] = [
    {
      id: 'welcome',
      type: 'agent',
      agentScript: `Hello, thank you for calling ${businessName}! How may I assist you today?`,
      conditions: [
        { condition: 'User wants to schedule an appointment', nextNodeId: 'schedule-1' },
        { condition: 'User has questions about services', nextNodeId: 'services-1' },
        { condition: 'User wants to speak with a person', nextNodeId: 'transfer-1' },
        { condition: 'User has an urgent matter', nextNodeId: 'urgent-1' },
        { condition: 'User wants pricing information', nextNodeId: 'pricing-1' },
      ]
    },
    {
      id: 'schedule-1',
      type: 'user',
      userResponse: `Hi, I'd like to schedule an appointment please.`,
      nextNodeId: 'schedule-2'
    },
    {
      id: 'schedule-2',
      type: 'agent',
      agentScript: `I'd be happy to help you schedule an appointment! Are you a new patient/client or have you visited us before?`,
      conditions: [
        { condition: 'User is a new patient/client', nextNodeId: 'new-client-1' },
        { condition: 'User is an existing patient/client', nextNodeId: 'existing-client-1' },
      ]
    },
    {
      id: 'new-client-1',
      type: 'user',
      userResponse: `I'm new, this would be my first time.`,
      nextNodeId: 'new-client-2'
    },
    {
      id: 'new-client-2',
      type: 'agent',
      agentScript: `Welcome! We're excited to have you. Let me collect some information to get you set up. May I have your full name please?`,
      nextNodeId: 'new-client-3'
    },
    {
      id: 'new-client-3',
      type: 'user',
      userResponse: `Sure, my name is Sarah Johnson.`,
      nextNodeId: 'new-client-4'
    },
    {
      id: 'new-client-4',
      type: 'agent',
      agentScript: `Thank you, Sarah. And what's the best phone number to reach you at?`,
      nextNodeId: 'new-client-5'
    },
    {
      id: 'new-client-5',
      type: 'user',
      userResponse: `It's 555-123-4567.`,
      nextNodeId: 'new-client-6'
    },
    {
      id: 'new-client-6',
      type: 'agent',
      agentScript: `Perfect. And your email address for appointment confirmations?`,
      nextNodeId: 'new-client-7'
    },
    {
      id: 'new-client-7',
      type: 'user',
      userResponse: `sarah.johnson@email.com`,
      nextNodeId: 'crm-create'
    },
    {
      id: 'crm-create',
      type: 'integration',
      integrationName: crmIntegration?.name || 'CRM System',
      integrationAction: `Create new client profile for Sarah Johnson with contact information`,
      nextNodeId: 'service-type-1'
    },
    {
      id: 'service-type-1',
      type: 'agent',
      agentScript: `Great, I've got your information. What type of ${services[0] || 'service'} are you looking for today?`,
      nextNodeId: 'service-type-2'
    },
    {
      id: 'service-type-2',
      type: 'user',
      userResponse: `I need a ${services[0] || 'consultation'} appointment.`,
      nextNodeId: 'check-availability'
    },
    {
      id: 'existing-client-1',
      type: 'user',
      userResponse: `I've been there before, my name is Sarah Johnson.`,
      nextNodeId: 'lookup-client'
    },
    {
      id: 'lookup-client',
      type: 'integration',
      integrationName: crmIntegration?.name || 'CRM System',
      integrationAction: `Look up existing client: Sarah Johnson - Retrieve profile, appointment history, and preferences`,
      nextNodeId: 'existing-client-2'
    },
    {
      id: 'existing-client-2',
      type: 'agent',
      agentScript: `Welcome back, Sarah! I see you were last here on November 15th. What type of appointment would you like to schedule today?`,
      nextNodeId: 'existing-client-3'
    },
    {
      id: 'existing-client-3',
      type: 'user',
      userResponse: `I'd like to schedule a follow-up appointment.`,
      nextNodeId: 'check-availability'
    },
    {
      id: 'check-availability',
      type: 'integration',
      integrationName: schedulingIntegration?.name || 'Scheduling System',
      integrationAction: `Check available appointment slots for the next 2 weeks`,
      nextNodeId: 'offer-times-1'
    },
    {
      id: 'offer-times-1',
      type: 'agent',
      agentScript: `I have several openings this week. Would you prefer a morning or afternoon appointment?`,
      conditions: [
        { condition: 'User prefers morning', nextNodeId: 'morning-times' },
        { condition: 'User prefers afternoon', nextNodeId: 'afternoon-times' },
        { condition: 'User needs a specific day', nextNodeId: 'specific-day' },
      ]
    },
    {
      id: 'morning-times',
      type: 'user',
      userResponse: `Morning would be better for me.`,
      nextNodeId: 'morning-options'
    },
    {
      id: 'morning-options',
      type: 'agent',
      agentScript: `For morning appointments, I have Tuesday at 9:30 AM, Wednesday at 10:00 AM, or Thursday at 9:00 AM. Which works best for you?`,
      nextNodeId: 'select-time'
    },
    {
      id: 'afternoon-times',
      type: 'user',
      userResponse: `Afternoon works better for me.`,
      nextNodeId: 'afternoon-options'
    },
    {
      id: 'afternoon-options',
      type: 'agent',
      agentScript: `For afternoon appointments, I have Tuesday at 2:00 PM, Wednesday at 3:30 PM, or Friday at 1:00 PM. Which would you prefer?`,
      nextNodeId: 'select-time'
    },
    {
      id: 'specific-day',
      type: 'user',
      userResponse: `Do you have anything available on Thursday?`,
      nextNodeId: 'thursday-options'
    },
    {
      id: 'thursday-options',
      type: 'agent',
      agentScript: `On Thursday I have 9:00 AM, 11:30 AM, or 2:30 PM available. Would any of those work for you?`,
      nextNodeId: 'select-time'
    },
    {
      id: 'select-time',
      type: 'user',
      userResponse: `The 10:00 AM on Wednesday sounds perfect.`,
      nextNodeId: 'book-appointment'
    },
    {
      id: 'book-appointment',
      type: 'integration',
      integrationName: schedulingIntegration?.name || 'Scheduling System',
      integrationAction: `Book appointment: Wednesday at 10:00 AM for Sarah Johnson - Confirmation #APT-2024-1234`,
      nextNodeId: 'confirm-booking'
    },
    {
      id: 'confirm-booking',
      type: 'agent',
      agentScript: `Excellent! I've booked your appointment for Wednesday at 10:00 AM. Your confirmation number is APT-2024-1234. Would you like me to send you a confirmation via text or email?`,
      conditions: [
        { condition: 'User wants text confirmation', nextNodeId: 'send-sms' },
        { condition: 'User wants email confirmation', nextNodeId: 'send-email' },
        { condition: 'User wants both', nextNodeId: 'send-both' },
      ]
    },
    {
      id: 'send-sms',
      type: 'integration',
      integrationName: communicationIntegration?.name || 'Twilio',
      integrationAction: `Send SMS confirmation to 555-123-4567: "Your appointment at ${businessName} is confirmed for Wednesday at 10:00 AM. Confirmation #APT-2024-1234"`,
      nextNodeId: 'confirmation-sent'
    },
    {
      id: 'send-email',
      type: 'integration',
      integrationName: 'Email Service',
      integrationAction: `Send email confirmation to sarah.johnson@email.com with appointment details and calendar invite`,
      nextNodeId: 'confirmation-sent'
    },
    {
      id: 'send-both',
      type: 'integration',
      integrationName: communicationIntegration?.name || 'Communication Hub',
      integrationAction: `Send both SMS to 555-123-4567 and email to sarah.johnson@email.com with appointment confirmation`,
      nextNodeId: 'confirmation-sent'
    },
    {
      id: 'confirmation-sent',
      type: 'agent',
      agentScript: `Your confirmation has been sent. You'll also receive a reminder 24 hours before your appointment. Is there anything else I can help you with today?`,
      conditions: [
        { condition: 'User has additional questions', nextNodeId: 'additional-help' },
        { condition: 'User is all set', nextNodeId: 'end-call' },
      ]
    },
    {
      id: 'additional-help',
      type: 'user',
      userResponse: `Actually, what should I bring to my appointment?`,
      nextNodeId: 'preparation-info'
    },
    {
      id: 'preparation-info',
      type: 'agent',
      agentScript: `Great question! Please bring a valid ID and your insurance card if applicable. If you have any relevant documents or previous records, those would be helpful as well. We also recommend arriving about 10 minutes early to complete any necessary paperwork. Anything else?`,
      conditions: [
        { condition: 'User has more questions', nextNodeId: 'more-questions' },
        { condition: 'User is satisfied', nextNodeId: 'end-call' },
      ]
    },
    {
      id: 'more-questions',
      type: 'user',
      userResponse: `No, that's everything I needed. Thank you!`,
      nextNodeId: 'end-call'
    },
    {
      id: 'services-1',
      type: 'user',
      userResponse: `I have some questions about your services.`,
      nextNodeId: 'services-2'
    },
    {
      id: 'services-2',
      type: 'agent',
      agentScript: `I'd be happy to tell you about our services! We offer ${services.slice(0, 3).join(', ')}${services.length > 3 ? ', and more' : ''}. What specifically would you like to know more about?`,
      conditions: [
        { condition: 'User asks about specific service', nextNodeId: 'service-details' },
        { condition: 'User wants to schedule after learning', nextNodeId: 'schedule-1' },
        { condition: 'User wants pricing', nextNodeId: 'pricing-1' },
      ]
    },
    {
      id: 'service-details',
      type: 'user',
      userResponse: `Can you tell me more about ${services[0] || 'your main service'}?`,
      nextNodeId: 'explain-service'
    },
    {
      id: 'explain-service',
      type: 'agent',
      agentScript: `Absolutely! ${services[0] || 'Our primary service'} is one of our most popular offerings. It typically takes about 30-60 minutes and our experienced team ensures the highest quality care. Would you like to schedule an appointment to experience it for yourself?`,
      conditions: [
        { condition: 'User wants to schedule', nextNodeId: 'schedule-2' },
        { condition: 'User has more questions', nextNodeId: 'more-service-questions' },
      ]
    },
    {
      id: 'pricing-1',
      type: 'user',
      userResponse: `What are your prices?`,
      nextNodeId: 'pricing-2'
    },
    {
      id: 'pricing-2',
      type: 'agent',
      agentScript: `Our pricing varies depending on the specific service. For a general consultation, our rates start at a competitive price point. We also accept most major insurance plans and offer payment plans for your convenience. Would you like me to check if we accept your specific insurance, or would you prefer to speak with our billing department for detailed pricing?`,
      conditions: [
        { condition: 'User wants insurance check', nextNodeId: 'insurance-check' },
        { condition: 'User wants to speak with billing', nextNodeId: 'transfer-billing' },
        { condition: 'User is satisfied', nextNodeId: 'schedule-prompt' },
      ]
    },
    {
      id: 'insurance-check',
      type: 'integration',
      integrationName: 'Insurance Verification System',
      integrationAction: `Check insurance eligibility and coverage details`,
      nextNodeId: 'insurance-result'
    },
    {
      id: 'insurance-result',
      type: 'agent',
      agentScript: `I can verify your insurance coverage when you come in for your appointment. Just bring your insurance card and we'll handle everything. Would you like to schedule an appointment now?`,
      conditions: [
        { condition: 'User wants to schedule', nextNodeId: 'schedule-2' },
        { condition: 'User will call back', nextNodeId: 'end-call' },
      ]
    },
    {
      id: 'transfer-1',
      type: 'user',
      userResponse: `I'd like to speak with a real person please.`,
      nextNodeId: 'transfer-2'
    },
    {
      id: 'transfer-2',
      type: 'agent',
      agentScript: `Of course, I understand. Let me transfer you to one of our team members. May I ask what this is regarding so I can connect you with the right person?`,
      conditions: [
        { condition: 'User explains reason', nextNodeId: 'transfer-connect' },
        { condition: 'User prefers not to say', nextNodeId: 'transfer-general' },
      ]
    },
    {
      id: 'transfer-connect',
      type: 'integration',
      integrationName: 'Phone System',
      integrationAction: `Initiate warm transfer to appropriate department based on caller needs`,
      nextNodeId: 'transfer-complete'
    },
    {
      id: 'transfer-general',
      type: 'integration',
      integrationName: 'Phone System',
      integrationAction: `Initiate transfer to main reception line`,
      nextNodeId: 'transfer-complete'
    },
    {
      id: 'transfer-complete',
      type: 'agent',
      agentScript: `I'm connecting you now. Please hold for just a moment. Thank you for calling ${businessName}!`,
      nextNodeId: 'end-transfer'
    },
    {
      id: 'urgent-1',
      type: 'user',
      userResponse: `This is urgent, I need help right away!`,
      nextNodeId: 'urgent-2'
    },
    {
      id: 'urgent-2',
      type: 'agent',
      agentScript: `I understand this is urgent and I want to help you right away. Can you briefly describe what's happening so I can get you the appropriate assistance?`,
      conditions: [
        { condition: 'True emergency requiring 911', nextNodeId: 'emergency-911' },
        { condition: 'Urgent but not emergency', nextNodeId: 'urgent-assist' },
      ]
    },
    {
      id: 'emergency-911',
      type: 'agent',
      agentScript: `This sounds like it may require immediate emergency attention. Please hang up and dial 911 right away. If you need our assistance after speaking with emergency services, please call us back.`,
      nextNodeId: 'end-emergency'
    },
    {
      id: 'urgent-assist',
      type: 'agent',
      agentScript: `I understand the urgency. Let me connect you with our on-call team member who can assist you immediately.`,
      nextNodeId: 'transfer-connect'
    },
    {
      id: 'schedule-prompt',
      type: 'agent',
      agentScript: `Would you like me to help you schedule an appointment today?`,
      conditions: [
        { condition: 'User wants to schedule', nextNodeId: 'schedule-2' },
        { condition: 'User will call back', nextNodeId: 'end-call' },
      ]
    },
    {
      id: 'end-call',
      type: 'agent',
      agentScript: `Thank you so much for calling ${businessName}! We look forward to seeing you soon. Have a wonderful day!`,
      nextNodeId: 'end'
    },
    {
      id: 'end-transfer',
      type: 'end',
      agentScript: `Call transferred successfully.`,
    },
    {
      id: 'end-emergency',
      type: 'end',
      agentScript: `Emergency guidance provided.`,
    },
    {
      id: 'end',
      type: 'end',
      agentScript: `Call completed successfully.`,
    },
  ];

  return flow;
}

function generateFollowUpFlow(
  businessName: string,
  industry: string,
  services: string[],
  integrations: Integration[],
  crmIntegration: Integration | undefined,
  communicationIntegration: Integration | undefined
): ConversationNode[] {
  return [
    {
      id: 'welcome',
      type: 'agent',
      agentScript: `Hello, this is ${businessName} calling. Am I speaking with Sarah?`,
      nextNodeId: 'confirm-identity'
    },
    {
      id: 'confirm-identity',
      type: 'user',
      userResponse: `Yes, this is Sarah. Hi!`,
      nextNodeId: 'followup-intro'
    },
    {
      id: 'followup-intro',
      type: 'agent',
      agentScript: `Hi Sarah! I'm following up on your recent visit with us on Monday. How are you feeling today?`,
      nextNodeId: 'patient-response'
    },
    {
      id: 'patient-response',
      type: 'user',
      userResponse: `I'm doing well, thanks for checking in. Everything seems fine so far.`,
      nextNodeId: 'check-symptoms'
    },
    {
      id: 'check-symptoms',
      type: 'agent',
      agentScript: `That's wonderful to hear! Have you experienced any discomfort, swelling, or anything unusual since your ${services[0] || 'treatment'}?`,
      nextNodeId: 'symptoms-response'
    },
    {
      id: 'symptoms-response',
      type: 'user',
      userResponse: `Actually, I've had some minor sensitivity, but nothing too bad.`,
      nextNodeId: 'log-feedback'
    },
    {
      id: 'log-feedback',
      type: 'integration',
      integrationName: crmIntegration?.name || 'CRM System',
      integrationAction: `Log follow-up feedback: Patient reports minor sensitivity post-treatment. Flag for provider review.`,
      nextNodeId: 'address-concern'
    },
    {
      id: 'address-concern',
      type: 'agent',
      agentScript: `Thank you for letting me know. Some minor sensitivity is normal and should subside within a few days. I've noted this in your file. Are you following the aftercare instructions we provided?`,
      nextNodeId: 'aftercare-response'
    },
    {
      id: 'aftercare-response',
      type: 'user',
      userResponse: `Yes, I've been following them. Should I be doing anything else?`,
      nextNodeId: 'aftercare-tips'
    },
    {
      id: 'aftercare-tips',
      type: 'agent',
      agentScript: `You're doing great! Just continue with gentle care and avoid very hot or cold foods for another day or two. If the sensitivity persists beyond a week or worsens, please call us right away.`,
      nextNodeId: 'patient-acknowledgment'
    },
    {
      id: 'patient-acknowledgment',
      type: 'user',
      userResponse: `Okay, that's helpful. Thank you!`,
      nextNodeId: 'followup-appointment'
    },
    {
      id: 'followup-appointment',
      type: 'agent',
      agentScript: `You're welcome! Just a reminder, you have a follow-up appointment scheduled for next Thursday at 2:00 PM. Does that still work for you?`,
      nextNodeId: 'confirm-appointment'
    },
    {
      id: 'confirm-appointment',
      type: 'user',
      userResponse: `Yes, I have it on my calendar. I'll be there.`,
      nextNodeId: 'send-reminder'
    },
    {
      id: 'send-reminder',
      type: 'integration',
      integrationName: communicationIntegration?.name || 'Twilio',
      integrationAction: `Schedule appointment reminder SMS for Wednesday evening: "Hi Sarah, reminder of your follow-up at ${businessName} tomorrow at 2:00 PM."`,
      nextNodeId: 'reminder-confirmed'
    },
    {
      id: 'reminder-confirmed',
      type: 'agent',
      agentScript: `Perfect! I'll send you a reminder the day before. Is there anything else you'd like to ask about your care?`,
      nextNodeId: 'final-questions'
    },
    {
      id: 'final-questions',
      type: 'user',
      userResponse: `No, I think I'm all set. Thanks for calling to check on me!`,
      nextNodeId: 'closing'
    },
    {
      id: 'closing',
      type: 'agent',
      agentScript: `It's our pleasure, Sarah. We're here if you need anything. Take care and we'll see you next Thursday!`,
      nextNodeId: 'end'
    },
    {
      id: 'end',
      type: 'end',
      agentScript: `Follow-up call completed successfully.`,
    },
  ];
}

function generateEmergencyFlow(
  businessName: string,
  industry: string,
  services: string[],
  integrations: Integration[],
  crmIntegration: Integration | undefined,
  communicationIntegration: Integration | undefined
): ConversationNode[] {
  return [
    {
      id: 'welcome',
      type: 'agent',
      agentScript: `${businessName}, how can I help you?`,
      nextNodeId: 'urgent-call'
    },
    {
      id: 'urgent-call',
      type: 'user',
      userResponse: `Hi, I'm having an emergency situation. I need help right away!`,
      nextNodeId: 'assess-urgency'
    },
    {
      id: 'assess-urgency',
      type: 'agent',
      agentScript: `I understand this is urgent and I'm here to help. Can you briefly tell me what's happening so I can get you the right assistance immediately?`,
      nextNodeId: 'describe-emergency'
    },
    {
      id: 'describe-emergency',
      type: 'user',
      userResponse: `I'm experiencing severe pain and it started suddenly about an hour ago. It's getting worse.`,
      nextNodeId: 'gather-details'
    },
    {
      id: 'gather-details',
      type: 'agent',
      agentScript: `I'm sorry you're going through this. Are you in a safe location right now? And can you tell me your name so I can pull up your information?`,
      nextNodeId: 'provide-info'
    },
    {
      id: 'provide-info',
      type: 'user',
      userResponse: `Yes, I'm at home. My name is Michael Chen.`,
      nextNodeId: 'lookup-patient'
    },
    {
      id: 'lookup-patient',
      type: 'integration',
      integrationName: crmIntegration?.name || 'CRM System',
      integrationAction: `URGENT: Look up patient Michael Chen - Retrieve medical history, allergies, and emergency contacts`,
      nextNodeId: 'confirm-identity'
    },
    {
      id: 'confirm-identity',
      type: 'agent',
      agentScript: `Thank you, Michael. I have your information here. Based on what you're describing, I'm going to connect you with our on-call provider immediately. Before I do, is there any other symptom I should relay to them?`,
      nextNodeId: 'additional-symptoms'
    },
    {
      id: 'additional-symptoms',
      type: 'user',
      userResponse: `I also feel a bit dizzy and nauseous.`,
      nextNodeId: 'log-emergency'
    },
    {
      id: 'log-emergency',
      type: 'integration',
      integrationName: crmIntegration?.name || 'CRM System',
      integrationAction: `LOG EMERGENCY: Patient Michael Chen - Severe pain (sudden onset 1hr), dizziness, nausea. Priority: HIGH. Timestamp: ${new Date().toISOString()}`,
      nextNodeId: 'escalate'
    },
    {
      id: 'escalate',
      type: 'agent',
      agentScript: `I've noted all of that. Michael, given these symptoms, I'm transferring you to our on-call provider right now. Please stay on the line - they'll be with you in just a moment.`,
      nextNodeId: 'notify-oncall'
    },
    {
      id: 'notify-oncall',
      type: 'integration',
      integrationName: 'Phone System',
      integrationAction: `EMERGENCY ESCALATION: Page on-call provider. Patient: Michael Chen. Symptoms: Severe sudden pain, dizziness, nausea. Initiating priority transfer.`,
      nextNodeId: 'send-alert'
    },
    {
      id: 'send-alert',
      type: 'integration',
      integrationName: communicationIntegration?.name || 'Twilio',
      integrationAction: `Send SMS alert to on-call provider: "URGENT: Emergency call transferring - Michael Chen with severe pain, dizziness, nausea. Accept transfer immediately."`,
      nextNodeId: 'hold-message'
    },
    {
      id: 'hold-message',
      type: 'agent',
      agentScript: `Michael, our on-call provider has been alerted and is picking up now. You're in good hands. If for any reason you feel this is a life-threatening emergency, please hang up and dial 911 immediately.`,
      nextNodeId: 'transfer-complete'
    },
    {
      id: 'transfer-complete',
      type: 'integration',
      integrationName: 'Phone System',
      integrationAction: `Emergency transfer completed. Call handed off to Dr. Williams (on-call). Duration: 2:34. All notes and patient history shared.`,
      nextNodeId: 'end'
    },
    {
      id: 'end',
      type: 'end',
      agentScript: `Emergency call escalated successfully to on-call provider.`,
    },
  ];
}

export function getIndustryFromUrl(url: string): string {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('dental') || lowerUrl.includes('dentist') || lowerUrl.includes('orthodont')) return 'dental';
  if (lowerUrl.includes('medical') || lowerUrl.includes('clinic') || lowerUrl.includes('doctor') || lowerUrl.includes('health')) return 'medical';
  if (lowerUrl.includes('hotel') || lowerUrl.includes('resort') || lowerUrl.includes('inn') || lowerUrl.includes('lodge')) return 'hotel';
  if (lowerUrl.includes('vet') || lowerUrl.includes('animal') || lowerUrl.includes('pet')) return 'veterinary';
  if (lowerUrl.includes('law') || lowerUrl.includes('legal') || lowerUrl.includes('attorney')) return 'legal';
  if (lowerUrl.includes('real') || lowerUrl.includes('estate') || lowerUrl.includes('realty')) return 'realestate';
  if (lowerUrl.includes('restaurant') || lowerUrl.includes('cafe') || lowerUrl.includes('bistro') || lowerUrl.includes('dining')) return 'restaurant';
  if (lowerUrl.includes('insurance') || lowerUrl.includes('policy') || lowerUrl.includes('coverage')) return 'insurance';
  if (lowerUrl.includes('gym') || lowerUrl.includes('fitness') || lowerUrl.includes('yoga') || lowerUrl.includes('pilates')) return 'fitness';
  if (lowerUrl.includes('auto') || lowerUrl.includes('car') || lowerUrl.includes('mechanic') || lowerUrl.includes('dealer')) return 'automotive';
  if (lowerUrl.includes('spa') || lowerUrl.includes('salon') || lowerUrl.includes('beauty') || lowerUrl.includes('massage')) return 'spa';
  if (lowerUrl.includes('school') || lowerUrl.includes('university') || lowerUrl.includes('college') || lowerUrl.includes('education')) return 'education';
  if (lowerUrl.includes('construct') || lowerUrl.includes('contractor') || lowerUrl.includes('builder') || lowerUrl.includes('roofing')) return 'construction';
  if (lowerUrl.includes('property') || lowerUrl.includes('apartment') || lowerUrl.includes('rental') || lowerUrl.includes('landlord')) return 'property';
  if (lowerUrl.includes('travel') || lowerUrl.includes('tour') || lowerUrl.includes('vacation') || lowerUrl.includes('trip')) return 'travel';
  if (lowerUrl.includes('wealth') || lowerUrl.includes('financial') || lowerUrl.includes('advisor') || lowerUrl.includes('invest')) return 'wealth';
  
  return 'medical';
}
