import AgentCard from '../AgentCard';
import { PhoneCall } from 'lucide-react';

export default function AgentCardExample() {
  return (
    <div className="p-6">
      <AgentCard
        icon={PhoneCall}
        title="AI Sales Agent"
        description="Qualify, pitch, and close — logs to CRM"
        index={0}
      />
    </div>
  );
}
