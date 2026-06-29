import {SectionWithGrid} from '@shared/ui/SectionWithGrid';
import {CardStep} from '@entities/step';
import {howItWorksHeader, howItWorksSteps} from '../config/content';

export const HowItWorks = () => {
  return (
    <SectionWithGrid id="how-it-works" headerProps={howItWorksHeader}>
      {howItWorksSteps.map((item) => (
        <CardStep
          key={item.step}
          step={item.step}
          title={item.title}
          description={item.description}
        />
      ))}
    </SectionWithGrid>
  );
};
