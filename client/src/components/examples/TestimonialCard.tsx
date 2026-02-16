import TestimonialCard from '../TestimonialCard';
import avatar from '@assets/generated_images/Testimonial_avatar_woman_executive_bbef7a48.png';

export default function TestimonialCardExample() {
  return (
    <div className="p-6">
      <TestimonialCard
        name="Sarah Johnson"
        role="CEO"
        company="TechCorp"
        content="Voicely Agent transformed our customer service. We're handling 10x more calls with better quality."
        rating={5}
        avatar={avatar}
        index={0}
      />
    </div>
  );
}
