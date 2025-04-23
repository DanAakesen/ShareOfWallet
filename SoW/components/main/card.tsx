import React, { useState, useEffect } from "react";
import { Text } from "@fluentui/react";
import { 
  insightCardStyles, 
  cardHeaderStyles, 
  cardContentStyles, 
  cardTabsStyles,
  copilotColors,
  closeButtonStyle,
  barChartContainerStyles,
  yAxisLabelsContainerStyles,
  yAxisLabelStyles,
  topGridLineStyles,
  middleGridLineStyles,
  bottomGridLineStyles,
  barsContainerStyles,
  barsFlexContainerStyles,
  barItemStyles,
  barGrowContainerStyles,
  getBarStyles,
  barValueStyles,
  barTooltipStyles,
  getStackedBarStyles,  // Import from styles instead of opportunityDataSet
  tooltipTitleStyles,
  tooltipArrowStyles,
  barYearLabelStyles,
  chartLegendContainerStyles,
  chartLegendBarStyles,
  chartLegendTextStyles,
  predictionChartContainerStyles,
  predictionAxisLabelsStyles,
  predictionXAxisStyles,
  predictionXAxisLabelStyles,
  predictionLegendContainerStyles,
  predictionLegendItemStyles,
  predictionLineStyles,
  predictionDashedLineStyles,
  activeOpportunitiesContainerStyles,
  opportunityStatBoxStyles,
  opportunityStatLabelStyles,
  opportunityStatValueStyles,
  opportunitiesListContainerStyles,
  opportunityItemStyles,
  opportunityHeaderStyles,
  opportunityTitleStyles,
  opportunityValueStyles,
  opportunityDetailsStyles,
  progressBarContainerStyles,
  getProgressBarStyles,
  emptyStateStyles,
  outlierContainerStyles,
  outlierItemStyles,
  outlierIndicatorStyles,
  outlierConfidenceLabelStyles,
  outlierFootnoteStyles,
  outlierFootnoteTextStyles,
  winLossContainerStyles,
  winLossHeaderStyles,
  winLossBarContainerStyles,
  getWinLossBarStyles,
  winLossSummaryStyles,
  winLossVisualizationStyles,
  wonSectionStyles,
  lostSectionStyles,
  wonCountStyles,
  lostCountStyles,
  winLossLabelStyles,
  getCircularProgressStyles,
  circularValueStyles,
  winLossRatioLabelStyles,
  winLossRatioContainerStyles,
  clickableNameStyle,
  trendLineStyle,
  predictionLineStyle,
  getCardStyle,
  gradientBorderStyle,
  getTrendLineBackground,
  getPredictionLineBackground
} from "../../styles";

// Update imports to include the new utility function
import { 
  parseDecimalValue, 
  processOpportunitiesForChart, 
  getOutlierConfidenceLevel,
  calculateTrendLine,
  handleOpportunityClick as utilHandleOpportunityClick,
  processOpportunitiesByYear,
  getActiveOpportunities,
  getWonOpportunities,
  getLostOpportunities,
  getOutlierOpportunities,
  getPredictedWinOpportunities,
  formatCurrency,
  getProbabilityColor,
  processOpportunitiesForSow
} from "../../utils/opportunityDataSet";

// Import the RecordModal component
import { RecordModal } from './recordModal';

interface InsightCardProps {
  country?: string;
  position?: { x: number; y: number };
  isVisible?: boolean;
  onClose?: () => void;
  opportunityData?: ComponentFramework.PropertyTypes.DataSet;
  sowId?: string;
  context?: ComponentFramework.Context<any>; // Add context to props
}

export const InsightCard: React.FC<InsightCardProps> = ({ 
  country = "Denmark", 
  position = { x: 50, y: 50 },
  isVisible = true,
  onClose = () => {},
  opportunityData,
  sowId,
  context // Accept context from props
}) => {
  // State variables
  const [activeTab, setActiveTab] = useState('active');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [countryOpportunities, setCountryOpportunities] = useState<any[]>([]);
  
  // Modal state - simplified to directly open the record
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | undefined>(undefined);
  const [selectedEntityType, setSelectedEntityType] = useState<string | undefined>(undefined);

  // Handle tab click
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Process opportunity data when sowId or opportunityData changes
  useEffect(() => {
    // Use the utility function instead of inline code
    const opportunities = processOpportunitiesForSow(opportunityData, sowId, country);
    setCountryOpportunities(opportunities);
  }, [sowId, opportunityData, country]);

  // Use the new utility functions for filtering instead of inline filters
  const activeOpportunities = getActiveOpportunities(countryOpportunities);
  const wonOpportunities = getWonOpportunities(countryOpportunities);
  const lostOpportunities = getLostOpportunities(countryOpportunities);
  const outlierOpportunities = getOutlierOpportunities(activeOpportunities);

  // Use the utility function for handling opportunity clicks
  const handleOpportunityClick = (opportunityId: string) => {
    utilHandleOpportunityClick(
      opportunityId,
      opportunityData,
      setSelectedRecordId,
      setSelectedEntityType,
      setModalOpen
    );
  };

  // Create a wrapper for getProbabilityColor with copilotColors
  const getProbColorWithTheme = (probability: number): string => {
    return getProbabilityColor(probability, copilotColors);
  };

  // Render opportunities won by year for History tab
  const renderOpportunitiesWonChart = () => {
    // Use the utility function for processing opportunities by year
    const { yearData, maxCount } = processOpportunitiesByYear(wonOpportunities, lostOpportunities);
    
    // Handle case with no opportunities
    if (yearData.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '30px 20px' }}>
          <Text style={{ fontSize: 14, color: '#666' }}>
            No historical opportunities data available for this country.
          </Text>
        </div>
      );
    }
    
    return (
      <div style={barChartContainerStyles}>
        <Text style={{ ...cardContentStyles.sectionTitle, marginBottom: 12 }}>Opportunities Won/Lost by Year</Text>
        
        {/* Container with fixed height so bar heights can be directly compared */}
        <div style={{ position: 'relative', height: 180, marginBottom: 60, marginTop: 30 }}>
          
          {/* Y-axis labels showing count instead of revenue */}
          <div style={yAxisLabelsContainerStyles}>
            <Text style={yAxisLabelStyles}>{maxCount}</Text>
            <Text style={yAxisLabelStyles}>{Math.round(maxCount/2)}</Text>
            <Text style={yAxisLabelStyles}>0</Text>
          </div>
          
          {/* Grid lines */}
          <div style={topGridLineStyles} />
          <div style={middleGridLineStyles} />
          <div style={bottomGridLineStyles} />

          {/* Bars container */}
          <div style={{...barsContainerStyles, zIndex: 2}}>
            <div style={barsFlexContainerStyles}>
              {yearData.map((item, index) => {
                // Calculate heights for won and lost bars as percentage of maxCount
                const wonHeightPercent = maxCount > 0 ? (item.won / maxCount) * 100 : 0;
                const lostHeightPercent = maxCount > 0 ? (item.lost / maxCount) * 100 : 0;
                
                return (
                  <div key={index} style={barItemStyles}>
                    {/* Won opportunities bar - use same green as in Opportunity Performance section with correct transparency */}
                    <div style={barGrowContainerStyles}>
                      <div 
                        style={{
                          ...getStackedBarStyles(wonHeightPercent, 'rgba(16, 124, 16, 0.15)', index === hoveredBarIndex),
                          borderRadius: '3px 3px 0 0' // Round only top corners
                        }}
                        onMouseEnter={() => setHoveredBarIndex(index)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                      >
                        {/* Won count - only show if count > 0 and height is sufficient with solid green color */}
                        {item.won > 0 && wonHeightPercent > 15 && (
                          <div style={{ 
                            ...barValueStyles, 
                            fontSize: 10,
                            color: copilotColors.green, // Use solid green instead of white
                            textShadow: 'none' // Remove text shadow
                          }}>
                            {item.won}
                          </div>
                        )}
                      </div>
                      
                      {/* Lost opportunities bar - use same purple as in Opportunity Performance section with correct transparency */}
                      <div 
                        style={{
                          ...getStackedBarStyles(lostHeightPercent, 'rgba(134, 97, 197, 0.15)', index === hoveredBarIndex),
                          borderRadius: '0 0 3px 3px', // Round only bottom corners
                          marginTop: '1px' // Small gap between bars
                        }}
                        onMouseEnter={() => setHoveredBarIndex(index)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                      >
                        {/* Lost count - only show if count > 0 and height is sufficient with solid purple color */}
                        {item.lost > 0 && lostHeightPercent > 15 && (
                          <div style={{ 
                            ...barValueStyles, 
                            fontSize: 10,
                            color: copilotColors.purple, // Use solid purple instead of white
                            textShadow: 'none' // Remove text shadow
                          }}>
                            {item.lost}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Tooltip - show on hover with detailed info */}
                    {hoveredBarIndex === index && (
                      <div style={barTooltipStyles}>
                        <div style={tooltipTitleStyles}>{item.year}</div>
                        <div>Won: {item.won} ({formatCurrency(item.totalWonRevenue)})</div>
                        <div>Lost: {item.lost} ({formatCurrency(item.totalLostRevenue)})</div>
                        <div>Win Rate: {item.winRate}%</div>
                        <div style={tooltipArrowStyles}></div>
                      </div>
                    )}
                    
                    {/* Year label (below bar) - change from blue to dark text like headlines */}
                    <div style={{ 
                      position: 'absolute',
                      bottom: -30, 
                      fontSize: 13, 
                      fontWeight: 600,
                      color: '#323130' // Use dark text color instead of blue
                    }}>
                      {item.year}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Legend with colors matching the Opportunity Performance section with correct transparency */}
        <div style={chartLegendContainerStyles}>
          <div style={{ 
            width: 15, 
            height: 15, 
            backgroundColor: 'rgba(16, 124, 16, 0.15)', 
            marginRight: 8,
            borderRadius: 2 
          }}></div>
          <Text style={{ ...chartLegendTextStyles, marginRight: 15 }}>Won</Text>
          
          <div style={{ 
            width: 15, 
            height: 15, 
            backgroundColor: 'rgba(134, 97, 197, 0.15)', 
            marginRight: 8,
            borderRadius: 2 
          }}></div>
          <Text style={chartLegendTextStyles}>Lost</Text>
        </div>
      </div>
    );
  };

  // Render prediction graph for Prediction tab
  const renderPredictionChart = () => {
    // Group won opportunities by year
    const wonOppsByYear = processOpportunitiesForChart(wonOpportunities);
    
    // Use the utility function to get predicted win opportunities
    const predictedWinOpps = getPredictedWinOpportunities(activeOpportunities);
    
    // Get total revenue by year for predicted wins
    const predictedOppsByYear = processOpportunitiesForChart(predictedWinOpps);
    
    // Calculate trend line based on both won and predicted data
    const trendLineData = calculateTrendLine(wonOppsByYear, predictedOppsByYear);
    
    // Combine all years for axis including trend line years
    const wonYears = Object.keys(wonOppsByYear).map(year => parseInt(year, 10));
    const predictedYears = Object.keys(predictedOppsByYear).map(year => parseInt(year, 10));
    const trendYears = trendLineData.map((point: {year: number}) => point.year);
    const allYearsSet = new Set([...wonYears, ...predictedYears, ...trendYears]);
    const allYears = Array.from(allYearsSet).sort((a, b) => a - b);
    
    // No data to show
    if (allYears.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Text style={{ fontSize: 14, color: '#666' }}>No historical or predicted revenue data available</Text>
        </div>
      );
    }
    
    // Calculate chart dimensions
    const chartHeight = 150;
    const chartWidth = 320;
    
    // Find maximum revenue for Y-axis scaling
    const allRevenues = [
      ...Object.values(wonOppsByYear), 
      ...Object.values(predictedOppsByYear),
      ...trendLineData.map((point: {revenue: number}) => point.revenue)
    ];
    const maxRevenue = Math.max(...allRevenues) * 1.1;  // Add 10% for margin
    const minRevenue = 0;  // Start from zero
    const valueRange = maxRevenue - minRevenue;
    
    // Calculate x position for each year (scaled to chart width)
    const getXPosition = (year: number) => {
      const minYear = Math.min(...allYears);
      const maxYear = Math.max(...allYears);
      const totalYears = (maxYear - minYear) || 1;  // Prevent division by zero
      return ((year - minYear) / totalYears) * chartWidth;
    };
    
    // Calculate y position for each revenue value (scaled to chart height, inverted for SVG)
    const getYPosition = (revenue: number) => {
      return chartHeight - ((revenue - minRevenue) / valueRange) * chartHeight;
    };
    
    // Create data points for historical (won) line
    const historicalYears = Object.keys(wonOppsByYear).map(Number).sort();
    const historicalData = historicalYears.map(year => ({
      year,
      revenue: wonOppsByYear[year],
      isPrediction: false
    }));
    
    // Create data points for prediction line (active opportunities predicted to win)
    const predictionYears = Object.keys(predictedOppsByYear).map(Number).sort();
    const predictionData = predictionYears.map(year => ({
      year,
      revenue: predictedOppsByYear[year],
      isPrediction: true
    }));
        
    // Use the helper functions to create the backgroundImage styles
    const trendLineStyleWithColor = {
      ...trendLineStyle,
      backgroundImage: getTrendLineBackground(copilotColors.green)
    };
    
    const predictionLineStyleWithColor = {
      ...predictionLineStyle,
      backgroundImage: getPredictionLineBackground(copilotColors.purple)
    };
    
    return (
      <div style={barChartContainerStyles}>
        <div style={predictionChartContainerStyles}>
          {/* Y-axis labels */}
          <div style={predictionAxisLabelsStyles}>
            <Text style={{ fontSize: 9 }}>{formatCurrency(maxRevenue).replace('$', '')}</Text>
            <Text style={{ fontSize: 9 }}>{formatCurrency(maxRevenue/2).replace('$', '')}</Text>
            <Text style={{ fontSize: 9 }}>{formatCurrency(minRevenue).replace('$', '')}</Text>
          </div>

          {/* X-axis (years) */}
          <div style={predictionXAxisStyles}>
            {allYears.map((year, i) => (
              <Text key={`year-${i}`} style={predictionXAxisLabelStyles((getXPosition(year) / chartWidth) * 100)}>
                {year}
              </Text>
            ))}
          </div>

          {/* Use topGridLineStyles, etc. directly without modifying them */}
          <div style={topGridLineStyles} />
          <div style={middleGridLineStyles} />
          <div style={bottomGridLineStyles} />

          {/* Chart area with SVG */}
          <svg width={chartWidth} height={chartHeight} style={{ overflow: 'visible', position: 'relative', zIndex: 2 }}>
            {/* Historical data line (blue solid) - completed opportunities with status = Won */}
            {historicalData.length > 1 && (
              <path
                d={`M${getXPosition(historicalData[0].year)},${getYPosition(historicalData[0].revenue)} ${
                  historicalData.slice(1).map(d => `L${getXPosition(d.year)},${getYPosition(d.revenue)}`).join(' ')
                }`}
                stroke={copilotColors.blue}
                strokeWidth={3}
                fill="none"
              />
            )}

            {/* Prediction data line (purple dashed) - active opportunities with predictedOutcome = 1 */}
            {predictionData.length > 1 && (
              <path
                d={`M${getXPosition(predictionData[0].year)},${getYPosition(predictionData[0].revenue)} ${
                  predictionData.slice(1).map(d => `L${getXPosition(d.year)},${getYPosition(d.revenue)}`).join(' ')
                }`}
                stroke={copilotColors.purple}
                strokeWidth={3}
                strokeDasharray="6 3"
                fill="none"
              />
            )}
            
            {/* Trend line (green dotted) - average revenue trend */}
            {trendLineData.length > 1 && (
              <path
                d={`M${getXPosition(trendLineData[0].year)},${getYPosition(trendLineData[0].revenue)} ${
                  trendLineData.slice(1).map(d => `L${getXPosition(d.year)},${getYPosition(d.revenue)}`).join(' ')
                }`}
                stroke={copilotColors.green}
                strokeWidth={2}
                strokeDasharray="4 3"
                fill="none"
              />
            )}

            {/* Single data point for historicial data - show as circle */}
            {historicalData.length === 1 && (
              <circle
                cx={getXPosition(historicalData[0].year)}
                cy={getYPosition(historicalData[0].revenue)}
                r={5}
                fill="white"
                stroke={copilotColors.blue}
                strokeWidth={2}
              />
            )}

            {/* Single data point for predicted data - show as circle */}
            {predictionData.length === 1 && (
              <circle
                cx={getXPosition(predictionData[0].year)}
                cy={getYPosition(predictionData[0].revenue)}
                r={5}
                fill="white"
                stroke={copilotColors.purple}
                strokeWidth={2}
              />
            )}

            {/* Historical data points - won opportunities */}
            {historicalData.map((d: {year: number, revenue: number}, i: number) => {
              // Get text content to measure for dynamic background width
              const textContent = formatCurrency(d.revenue).replace('$', '');
              // Calculate dynamic width (each character is roughly 5-6px wide for 9px font, add 10px padding)
              const backgroundWidth = Math.max((textContent.length * 6) + 10, 40);
              
              return (
                <g key={`hist-${i}`}>
                  <circle
                    cx={getXPosition(d.year)}
                    cy={getYPosition(d.revenue)}
                    r={5}
                    fill="white"
                    stroke={copilotColors.blue}
                    strokeWidth={2}
                  />
                  {/* Add white background rectangle behind the text */}
                  <rect
                    x={getXPosition(d.year) - (backgroundWidth / 2)}
                    y={getYPosition(d.revenue) - 28}
                    width={backgroundWidth}
                    height={18}
                    rx={4}
                    fill="white"
                    fillOpacity={1} // Ensure 100% opacity to hide grid lines
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth={0.5}
                  />
                  <text
                    x={getXPosition(d.year)}
                    y={getYPosition(d.revenue) - 15}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight="bold"
                    fill="#333"
                  >
                    {textContent}
                  </text>
                </g>
              );
            })}

            {/* Prediction data points - predicted to win opportunities */}
            {predictionData.map((d, i) => {
              // Get text content to measure for dynamic background width
              const textContent = formatCurrency(d.revenue).replace('$', '');
              // Calculate dynamic width (each character is roughly 5-6px wide for 9px font, add 10px padding)
              const backgroundWidth = Math.max((textContent.length * 6) + 10, 40);
              
              return (
                <g key={`pred-${i}`}>
                  <circle
                    cx={getXPosition(d.year)}
                    cy={getYPosition(d.revenue)}
                    r={5}
                    fill="white"
                    stroke={copilotColors.purple}
                    strokeWidth={2}
                  />
                  {/* Add white background rectangle behind the text */}
                  <rect
                    x={getXPosition(d.year) - (backgroundWidth / 2)}
                    y={getYPosition(d.revenue) - 28}
                    width={backgroundWidth}
                    height={18}
                    rx={4}
                    fill="white"
                    fillOpacity={1} // Ensure 100% opacity to hide grid lines
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth={0.5}
                  />
                  <text
                    x={getXPosition(d.year)}
                    y={getYPosition(d.revenue) - 15}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight="bold"
                    fill="#333"
                  >
                    {textContent}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend - update to use the imported styles with color */}
        <div style={predictionLegendContainerStyles}>
          <div style={predictionLegendItemStyles}>
            <div style={predictionLineStyles} />
            <Text style={{ fontSize: 11 }}>Won Opportunities</Text>
          </div>
          <div style={predictionLegendItemStyles}>
            <div style={predictionLineStyleWithColor} />
            <Text style={{ fontSize: 11 }}>Predicted Wins</Text>
          </div>
          <div style={predictionLegendItemStyles}>
            <div style={trendLineStyleWithColor} />
            <Text style={{ fontSize: 11 }}>Trend Line</Text>
          </div>
        </div>
      </div>
    );
  };

  // Win/Loss ratio indicator
  const renderWinLossRatioIndicator = (ratio: number) => {
    return (
      <div style={winLossRatioContainerStyles}>
        <div style={getCircularProgressStyles(ratio)}>
          <div style={circularValueStyles}>{ratio}%</div>
        </div>
        <Text style={winLossRatioLabelStyles}>Win/Loss Ratio</Text>
      </div>
    );
  };

  // Calculate metrics from actual data for use in rendering
  const totalActiveOpportunities = activeOpportunities.length;
  const totalActiveValue = activeOpportunities.reduce((sum, opp) => sum + opp.revenue, 0);
  const avgProbability = totalActiveOpportunities 
    ? Math.round(activeOpportunities.reduce((sum, opp) => sum + opp.probability, 0) / totalActiveOpportunities) 
    : 0;
  
  const totalWonOpportunities = wonOpportunities.length;
  const totalLostOpportunities = lostOpportunities.length;
  const winLossRatio = (totalWonOpportunities + totalLostOpportunities) > 0 
    ? Math.round((totalWonOpportunities / (totalWonOpportunities + totalLostOpportunities)) * 100) 
    : 0;
  
  const totalWonRevenue = wonOpportunities.reduce((sum, opp) => sum + opp.revenue, 0);
  const totalLostRevenue = lostOpportunities.reduce((sum, opp) => sum + opp.revenue, 0);
  const avgDealSize = totalWonOpportunities > 0 ? totalWonRevenue / totalWonOpportunities : 0;

  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'active':
        return (
          <div>
            <div style={cardContentStyles.section}>
              <Text style={{ ...cardContentStyles.sectionTitle, marginBottom: 10 }}>Open Opportunities KPIs</Text>
              
              <div style={activeOpportunitiesContainerStyles}>
                <div style={{ ...opportunityStatBoxStyles, minWidth: '90px' }}>
                  <Text style={opportunityStatLabelStyles}>Opportunities</Text>
                  <Text style={opportunityStatValueStyles}>
                    {totalActiveOpportunities}
                  </Text>
                </div>
                
                <div style={{ ...opportunityStatBoxStyles, minWidth: '110px' }}>
                  <Text style={opportunityStatLabelStyles}>Total Value</Text>
                  <Text style={opportunityStatValueStyles}>
                    {formatCurrency(totalActiveValue)}
                  </Text>
                </div>
                
                <div style={{ ...opportunityStatBoxStyles, minWidth: '90px' }}>
                  <Text style={opportunityStatLabelStyles}>Avg. Probability</Text>
                  <Text style={opportunityStatValueStyles}>
                    {avgProbability}%
                  </Text>
                </div>
              </div>
            </div>

            <div style={cardContentStyles.section}>
              <Text style={{ ...cardContentStyles.sectionTitle, marginTop: 8, marginBottom: 16 }}>Open Opportunities</Text>
              
              {/* Scrollable container with increased height to show more opportunities */}
              <div style={{...opportunitiesListContainerStyles, maxHeight: '320px'}}>
                {activeOpportunities.length > 0 ? (
                  activeOpportunities.map((opportunity, index) => (
                    <div key={index} style={opportunityItemStyles}>
                      <div style={opportunityHeaderStyles}>
                        <Text 
                          style={clickableNameStyle}
                          onClick={() => opportunity.id && handleOpportunityClick(opportunity.id)}
                          className="clickable-opportunity-name"
                        >
                          {opportunity.name}
                        </Text>
                        <Text style={opportunityValueStyles}>
                          {formatCurrency(opportunity.revenue)}
                        </Text>
                      </div>
                      
                      <div style={opportunityDetailsStyles}>
                        <Text>Close: {opportunity.closeDate || 'N/A'}</Text>
                        <Text>Win/Loss: {opportunity.winLossRatio || 0}%</Text>
                      </div>
                      
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <Text style={{ fontSize: 12 }}>Probability</Text>
                          <Text style={{ fontSize: 12, fontWeight: 600 }}>{opportunity.probability || 0}%</Text>
                        </div>
                        <div style={progressBarContainerStyles}>
                          <div style={getProgressBarStyles(opportunity.probability || 0, getProbColorWithTheme(opportunity.probability || 0))} />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={emptyStateStyles}>
                    <Text style={{ fontSize: 15, color: '#666' }}>
                      No opportunities found for this country.
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      case 'prediction':
        return (
          <div>
            {/* Revenue projection chart */}
            <div>
              <Text style={{ ...cardContentStyles.sectionTitle, marginBottom: 12 }}>Revenue Prediction</Text>
              {renderPredictionChart()}
            </div>
            
            {/* Outliers Section */}
            <div style={{ marginTop: 24, marginBottom: 16 }}>
              <div style={{ paddingBottom: 10 }}>
                <Text style={{ ...cardContentStyles.sectionTitle }}>Potential Outliers</Text>
              </div>
              
              <div style={outlierContainerStyles}>
                {outlierOpportunities.length > 0 ? (
                  outlierOpportunities.map((outlier, index) => {
                    const confidence = getOutlierConfidenceLevel(outlier.outlierConfidence);
                    const isPredictedWin = outlier.predictedOutcome === 1;
                    
                    return (
                      <div key={index} style={outlierItemStyles(index === outlierOpportunities.length - 1)}>
                        <div>
                          <Text 
                            style={clickableNameStyle}
                            onClick={() => outlier.id && handleOpportunityClick(outlier.id)}
                            className="clickable-opportunity-name"
                          >
                            {outlier.name}
                            {isPredictedWin && (
                              <span style={{ 
                                color: copilotColors.green,
                                fontSize: '10px',
                                marginLeft: '5px',
                                fontWeight: 'normal'
                              }}>
                                (Predicted Win)
                              </span>
                            )}
                          </Text>
                          <div style={outlierConfidenceLabelStyles}>
                            <span style={outlierIndicatorStyles(confidence.isLow)}></span>
                            {confidence.text} confidence ({Math.round(outlier.outlierConfidence)}%)
                          </div>
                        </div>
                        <Text style={{ fontSize: 13, fontWeight: 600 }}>
                          {formatCurrency(outlier.revenue)}
                        </Text>
                      </div>
                    );
                  })
                ) : (
                  <div style={emptyStateStyles}>
                    <Text style={{ fontSize: 14, color: '#666' }}>
                      No outliers detected for this country.
                    </Text>
                  </div>
                )}
              </div>
              
              <div style={outlierFootnoteStyles}>
                <Text style={outlierFootnoteTextStyles}>
                  Outliers represent opportunities that may need additional 
                  review based on historical patterns and prediction confidence.
                </Text>
              </div>
            </div>
          </div>
        );
        
      case 'history': {
        return (
          <div>
            <div style={cardContentStyles.section}>
              <Text style={cardContentStyles.sectionTitle}>Historical Performance</Text>
              
              {/* Metrics with actual data */}
              <div style={cardContentStyles.metric}>
                <Text style={cardContentStyles.metricName}>Total Won Revenue:</Text>
                <Text style={{ ...cardContentStyles.metricValue, color: copilotColors.green }}>
                  {formatCurrency(totalWonRevenue)}
                </Text>
              </div>
              
              <div style={cardContentStyles.metric}>
                <Text style={cardContentStyles.metricName}>Total Lost Revenue:</Text>
                <Text style={{ ...cardContentStyles.metricValue, color: copilotColors.purple }}>
                  {formatCurrency(totalLostRevenue)}
                </Text>
              </div>
              
              <div style={cardContentStyles.metric}>
                <Text style={cardContentStyles.metricName}>Avg. Deal Size (Won):</Text>
                <Text style={cardContentStyles.metricValue}>
                  {formatCurrency(avgDealSize)}
                </Text>
              </div>
            </div>

            {renderOpportunitiesWonChart()}

            {/* Win/Loss Summary Section */}
            <div style={{ marginTop: 30, marginBottom: 8 }}>
              <Text style={{ ...cardContentStyles.sectionTitle, marginBottom: 12 }}>Opportunity Performance</Text>
              
              <div style={winLossContainerStyles}>
                {/* Win/Loss ratio bar */}
                <div>
                  <div style={winLossHeaderStyles}>
                    <Text style={{ fontSize: 12, fontWeight: 500 }}>Win/Loss Ratio</Text>
                    <Text style={{ fontSize: 12, fontWeight: 600 }}>{winLossRatio}%</Text>
                  </div>
                  
                  <div style={winLossBarContainerStyles}>
                    <div style={getWinLossBarStyles(winLossRatio)}/>
                  </div>
                </div>
                
                {/* Win/Loss count visualization */}
                <div>
                  <div style={winLossSummaryStyles}>
                    <Text style={{ fontSize: 12, fontWeight: 500 }}>
                      Total Opportunities: {totalWonOpportunities + totalLostOpportunities}
                    </Text>
                  </div>
                  
                  <div style={winLossVisualizationStyles}>
                    {/* Won section */}
                    <div style={{
                      ...wonSectionStyles,
                      flex: totalWonOpportunities || 1
                    }}>
                      <Text style={wonCountStyles}>
                        {totalWonOpportunities}
                      </Text>
                      <Text style={winLossLabelStyles}>Won</Text>
                    </div>
                    
                    {/* Lost section */}
                    <div style={{
                      ...lostSectionStyles,
                      flex: totalLostOpportunities || 1
                    }}>
                      <Text style={lostCountStyles}>
                        {totalLostOpportunities}
                      </Text>
                      <Text style={winLossLabelStyles}>Lost</Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
        
      default:
        return null;
    }
  };

  // Position the card based on mouse coordinates
  const cardStyleWithPosition = getCardStyle(position, isVisible, insightCardStyles);

  return (
    <div style={cardStyleWithPosition}>
      {/* Add CSS for hover effect on opportunity names */}
      <style>
        {`
          .clickable-opportunity-name:hover {
            color: ${copilotColors.darkPurple || "#5C2D91"} !important;
            text-decoration: underline;
          }
        `}
      </style>

      {/* Gradient border at top - Copilot style */}
      <div style={gradientBorderStyle} />

      {/* Close button - Fix by using the onClose prop instead of handleClose */}
      <button style={closeButtonStyle} onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}>
        ✕
      </button>

      {/* Card Header */}
      <div style={cardHeaderStyles.root}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <Text style={cardHeaderStyles.title}>Opportunity Insights:</Text>
          <Text style={cardHeaderStyles.countryText}>{country}</Text>
        </div>
      </div>

      {/* Tabs - Reordered to Active, Prediction, History */}
      <div style={cardTabsStyles.container}>
        <div 
          style={{
            ...cardTabsStyles.tab,
            ...(activeTab === 'active' ? cardTabsStyles.activeTab : {})
          }}
          onClick={() => handleTabClick('active')}
        >
          Active
        </div>
        <div 
          style={{
            ...cardTabsStyles.tab,
            ...(activeTab === 'prediction' ? cardTabsStyles.activeTab : {})
          }}
          onClick={() => handleTabClick('prediction')}
        >
          Prediction
        </div>
        <div 
          style={{
            ...cardTabsStyles.tab,
            ...(activeTab === 'history' ? cardTabsStyles.activeTab : {})
          }}
          onClick={() => handleTabClick('history')}
        >
          History
        </div>
      </div>

      {/* Dynamic Tab Content */}
      <div style={cardContentStyles.root}>
        {renderTabContent()}
      </div>
      
      {/* Add RecordModal component */}
      <RecordModal
        isOpen={modalOpen}
        onDismiss={() => setModalOpen(false)}
        recordId={selectedRecordId}
        entityType={selectedEntityType}
      />
    </div>
  );
};