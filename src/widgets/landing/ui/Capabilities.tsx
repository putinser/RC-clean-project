import {SectionWithGrid} from '@shared/ui/SectionWithGrid';
import {CardFeature} from '@entities/feature';
import {capabilitiesHeader, capabilitiesItems} from '../config/content';

export const Capabilities = () => {
  return (
    <SectionWithGrid
      id="capabilities"
      headerProps={capabilitiesHeader}
      backgroundClassName="bg-[#060b12]">
      {capabilitiesItems.map((item) => (
        <CardFeature
          key={item.title}
          title={item.title}
          description={item.description}
          icon={item.icon}
        />
      ))}
    </SectionWithGrid>
  );
};
