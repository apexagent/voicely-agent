import NeonFeatureCard from '../NeonFeatureCard';
import { Zap } from 'lucide-react';

export default function NeonFeatureCardExample() {
  return (
    <div className="p-8 flex items-center justify-center">
      <NeonFeatureCard
        icon={Zap}
        title="Instant Responses"
        description="Answer in milliseconds"
        index={0}
      />
    </div>
  );
}
