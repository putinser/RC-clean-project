import {Modal, Pressable, ScrollView, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {X} from 'lucide-react-native';
import {
  defaultChartMetric,
  getMetricOptions,
} from '../config/chartMetric';
import type {ChartPeriodId} from '../config/chartPeriod';
import {chartViewOptions} from '../config/chartView';
import {entityTypeOptions} from '../config/entityType';
import {getIntervalOptions, getPeriodOptions} from '../lib/chartFilters';
import type {ChartPanelState} from '../lib/chartPanel';
import {useChartLandscapeMode} from '../model/useChartLandscapeMode';
import type {ChartLayoutId} from '../config/chartLayout';
import {ChartInterval} from './ChartInterval';
import {ChartLayoutSelect} from './ChartLayoutSelect';
import {ChartPanel} from './ChartPanel';
import {ChartSelect, MetricSelect} from './ChartSelect';

type ChartVerticalSplitModalProps = {
  visible: boolean;
  panels: ChartPanelState[];
  activePanelIndex: number;
  layout: ChartLayoutId;
  isOnline: boolean;
  onActivatePanel: (index: number) => void;
  onChangePanel: (index: number, patch: Partial<ChartPanelState>) => void;
  onClosePanel: (index: number) => void;
  onLayoutChange: (layout: ChartLayoutId) => void;
  onClose: () => void;
};

export const ChartVerticalSplitModal = ({
  visible,
  panels,
  activePanelIndex,
  layout,
  isOnline,
  onActivatePanel,
  onChangePanel,
  onClosePanel,
  onLayoutChange,
  onClose,
}: ChartVerticalSplitModalProps) => {
  useChartLandscapeMode(visible);
  const insets = useSafeAreaInsets();

  const activePanel = panels[activePanelIndex] ?? panels[0];
  const metricOptions = getMetricOptions(activePanel?.view ?? 'buy-sell');
  const intervalOptions = getIntervalOptions(
    isOnline,
    activePanel?.view ?? 'buy-sell',
    activePanel?.period ?? 'six-months',
  );
  const periodOptions = getPeriodOptions(
    isOnline,
    activePanel?.view ?? 'buy-sell',
  );

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      supportedOrientations={['landscape-left', 'landscape-right']}
      onRequestClose={onClose}>
      <GestureHandlerRootView style={{flex: 1}}>
        <View
          className="flex-1 bg-background"
          style={{
            paddingLeft: Math.max(insets.left, 8),
            paddingRight: Math.max(insets.right, 8),
            paddingTop: Math.max(insets.top, 4),
            paddingBottom: Math.max(insets.bottom, 4),
          }}>
          <View className="mb-1.5 gap-1.5">
            <View className="flex-row items-center gap-1.5">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="min-w-0 flex-1"
                contentContainerStyle={{
                  alignItems: 'center',
                  gap: 6,
                  paddingRight: 4,
                }}>
                {activePanel?.view !== 'asset-price' ? (
                  <ChartInterval
                    interval={activePanel.interval}
                    handleInterval={(interval) =>
                      onChangePanel(activePanelIndex, {interval})
                    }
                    options={intervalOptions}
                  />
                ) : null}
                <View className="w-[140px]">
                  <ChartSelect
                    options={chartViewOptions}
                    value={activePanel.view}
                    onChange={(val) =>
                      onChangePanel(activePanelIndex, {
                        view: val as ChartPanelState['view'],
                        metric: defaultChartMetric,
                      })
                    }
                    ariaLabel="Вид графика"
                    compact
                  />
                </View>
                <View className="w-[110px]">
                  <ChartSelect
                    options={periodOptions.map((opt) => ({
                      id: opt.id,
                      label1: opt.label,
                    }))}
                    value={activePanel.period}
                    onChange={(val) =>
                      onChangePanel(activePanelIndex, {
                        period: val as ChartPeriodId,
                      })
                    }
                    ariaLabel="Период"
                    compact
                  />
                </View>
                {metricOptions ? (
                  <View className="w-[130px]">
                    <MetricSelect
                      options={metricOptions}
                      value={activePanel.metric}
                      onChange={(val) =>
                        onChangePanel(activePanelIndex, {
                          metric: val as ChartPanelState['metric'],
                        })
                      }
                      compact
                    />
                  </View>
                ) : null}
                <View className="w-[100px]">
                  <ChartSelect
                    options={entityTypeOptions}
                    value={activePanel.isFiz ? 'true' : 'false'}
                    onChange={(val) =>
                      onChangePanel(activePanelIndex, {isFiz: val === 'true'})
                    }
                    ariaLabel="Тип лица"
                    compact
                  />
                </View>
              </ScrollView>
              <ChartLayoutSelect value={layout} onChange={onLayoutChange} />
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Закрыть альбомный режим"
                className="h-8 w-8 items-center justify-center rounded-lg border border-[#464B52] bg-[#181B22]">
                <X size={16} color="#87A3AB" />
              </Pressable>
            </View>
          </View>

          <View className="min-h-0 flex-1 flex-row gap-2">
            {panels.map((panel, index) => (
              <ChartPanel
                key={panel.id}
                state={panel}
                onChange={(patch) => onChangePanel(index, patch)}
                isActive={activePanelIndex === index}
                dense
                fill
                hideLegend
                onActivate={() => onActivatePanel(index)}
                onClose={() => onClosePanel(index)}
              />
            ))}
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};
