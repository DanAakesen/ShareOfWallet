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
  barValueStyles,
  barTooltipStyles,
  getStackedBarStyles,  // Import from styles instead of opportunityDataSet
  tooltipTitleStyles,
  tooltipArrowStyles,
  chartLegendContainerStyles,
  chartLegendTextStyles,
  predictionChartContainerStyles,
  predictionAxisLabelsStyles,
  predictionXAxisStyles,
  predictionXAxisLabelStyles,
  predictionLegendContainerStyles,
  predictionLineStyles,
  activeOpportunitiesContainerStyles,
  opportunityStatBoxStyles,
  opportunityStatLabelStyles,
  opportunityStatValueStyles,
  opportunitiesListContainerStyles,
  opportunityItemStyles,
  opportunityHeaderStyles,
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
  const [hoveredPredictionPoint, setHoveredPredictionPoint] = useState<{x: number, y: number, data: any} | null>(null);
  
  // State for toggling prediction chart lines
  const [showWonOpportunities, setShowWonOpportunities] = useState(true);
  const [showPredictedWins, setShowPredictedWins] = useState(true);
  const [showTrendLine, setShowTrendLine] = useState(true);
  
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

  // Handle prediction chart hover
  const handlePredictionHover = (event: React.MouseEvent, year: number, revenue: number, opportunities: any[], isWon: boolean) => {
    const svgRect = (event.currentTarget.closest('svg') as SVGElement)?.getBoundingClientRect();
    const circleRect = event.currentTarget.getBoundingClientRect();
    
    if (svgRect) {
      // Calculate position relative to the SVG
      const relativeX = circleRect.left - svgRect.left + (circleRect.width / 2);
      const relativeY = circleRect.top - svgRect.top + (circleRect.height / 2);
      
      setHoveredPredictionPoint({
        x: relativeX,
        y: relativeY,
        data: {
          year,
          revenue,
          opportunities,
          isWon
        }
      });
    }
  };

  const handlePredictionHoverLeave = () => {
    setHoveredPredictionPoint(null);
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

    // Get opportunities by year for hover tooltips
    const getOpportunitiesForYear = (year: number, isWon: boolean) => {
      if (isWon) {
        return wonOpportunities.filter(opp => {
          if (!opp.closeDate) return false;
          const parts = opp.closeDate.split('/');
          if (parts.length === 3) {
            const oppYear = parseInt(parts[2], 10);
            return oppYear === year;
          }
          return false;
        });
      } else {
        return predictedWinOpps.filter(opp => {
          if (!opp.closeDate) return false;
          const parts = opp.closeDate.split('/');
          if (parts.length === 3) {
            const oppYear = parseInt(parts[2], 10);
            return oppYear === year;
          }
          return false;
        });
      }
    };
    
        
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
        <div style={{...predictionChartContainerStyles, position: 'relative'}}>
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
            {showWonOpportunities && historicalData.length > 1 && (
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
            {showPredictedWins && predictionData.length > 1 && (
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
            {showTrendLine && trendLineData.length > 1 && (
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
            {showWonOpportunities && historicalData.length === 1 && (
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
            {showPredictedWins && predictionData.length === 1 && (
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
            {showWonOpportunities && historicalData.map((d: {year: number, revenue: number}, i: number) => {
              const yearOpportunities = getOpportunitiesForYear(d.year, true);
              
              return (
                <g key={`hist-${i}`}>
                  <circle
                    cx={getXPosition(d.year)}
                    cy={getYPosition(d.revenue)}
                    r={5}
                    fill="white"
                    stroke={copilotColors.blue}
                    strokeWidth={2}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => handlePredictionHover(e, d.year, d.revenue, yearOpportunities, true)}
                    onMouseLeave={handlePredictionHoverLeave}
                  />
                </g>
              );
            })}

            {/* Prediction data points - predicted to win opportunities */}
            {showPredictedWins && predictionData.map((d, i) => {
              const yearOpportunities = getOpportunitiesForYear(d.year, false);
              
              return (
                <g key={`pred-${i}`}>
                  <circle
                    cx={getXPosition(d.year)}
                    cy={getYPosition(d.revenue)}
                    r={5}
                    fill="white"
                    stroke={copilotColors.purple}
                    strokeWidth={2}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => handlePredictionHover(e, d.year, d.revenue, yearOpportunities, false)}
                    onMouseLeave={handlePredictionHoverLeave}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Prediction Chart Hover Tooltip */}
        {hoveredPredictionPoint && (
          <div style={{
            position: 'absolute',
            left: (() => {
              const tooltipWidth = 250; // Estimated tooltip width
              const chartWidth = 320; // SVG chart width
              const padding = 10; // Padding from edges
              
              // If circle is in the left half, show tooltip to the right (closer)
              if (hoveredPredictionPoint.x < chartWidth / 2) {
                return Math.min(hoveredPredictionPoint.x + 8, chartWidth - tooltipWidth - padding);
              } 
              // If circle is in the right half, show tooltip to the left (closer)
              else {
                return Math.max(hoveredPredictionPoint.x - tooltipWidth - 8, padding);
              }
            })(),
            top: Math.max(hoveredPredictionPoint.y - 80, 10), // Position closer above circle
            backgroundColor: '#323130', // Dark background like history tab
            border: '1px solid #605e5c',
            borderRadius: '4px',
            padding: '8px 12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            fontSize: '11px',
            zIndex: 1000,
            minWidth: '200px',
            maxWidth: '250px',
            pointerEvents: 'none', // Prevent tooltip from interfering with mouse events
            color: 'white' // White text
          }}>
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: '6px',
              fontSize: '12px',
              borderBottom: '1px solid #605e5c',
              paddingBottom: '4px',
              color: 'white'
            }}>
              {hoveredPredictionPoint.data.year} - Total Revenue: {formatCurrency(hoveredPredictionPoint.data.revenue)}
            </div>
            
            {/* List of opportunities with headers */}
            {hoveredPredictionPoint.data.opportunities.length > 0 && (
              <div style={{ paddingTop: '4px' }}>
                {/* Column Headers */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                  fontSize: '10px',
                  gap: '8px',
                  fontWeight: 'bold',
                  color: '#f3f2f1', // Slightly lighter text for headers
                  borderBottom: '1px solid #605e5c',
                  paddingBottom: '2px'
                }}>
                  <span style={{ 
                    flex: '1', 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    Opportunity
                  </span>
                  <span style={{ 
                    minWidth: '30px',
                    textAlign: 'center'
                  }}>
                    Type
                  </span>
                  <span style={{ 
                    minWidth: '50px',
                    textAlign: 'right'
                  }}>
                    Revenue
                  </span>
                </div>
                
                {/* Opportunity Rows */}
                {hoveredPredictionPoint.data.opportunities.slice(0, 5).map((opp: any, index: number) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '2px',
                    fontSize: '10px',
                    gap: '8px',
                    color: 'white'
                  }}>
                    <span style={{ 
                      flex: '1', 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {opp.name}
                    </span>
                    <span style={{ 
                      color: hoveredPredictionPoint.data.isWon ? copilotColors.green : copilotColors.purple,
                      fontWeight: 'bold',
                      minWidth: '30px',
                      textAlign: 'center'
                    }}>
                      {hoveredPredictionPoint.data.isWon ? 'Won' : 'Pred'}
                    </span>
                    <span style={{ 
                      fontWeight: 'bold',
                      minWidth: '50px',
                      textAlign: 'right',
                      color: 'white'
                    }}>
                      {formatCurrency(opp.revenue).replace('$', '')}
                    </span>
                  </div>
                ))}
                {hoveredPredictionPoint.data.opportunities.length > 5 && (
                  <div style={{ 
                    fontSize: '10px', 
                    color: '#a19f9d', // Muted color for "more" text
                    marginTop: '4px',
                    fontStyle: 'italic'
                  }}>
                    +{hoveredPredictionPoint.data.opportunities.length - 5} more...
                  </div>
                )}
              </div>
            )}
            
            {/* Dynamic arrow pointing to the circle */}
            <div style={{
              position: 'absolute',
              top: (() => {
                // Position arrow to point toward the circle (adjusted for closer positioning)
                const arrowY = Math.min(Math.max(80, 15), 70); // Adjusted for closer positioning
                return `${arrowY}px`;
              })(),
              left: (() => {
                const tooltipWidth = 250;
                const chartWidth = 320;
                
                // If tooltip is to the right of circle, arrow on left side
                if (hoveredPredictionPoint.x < chartWidth / 2) {
                  return '-6px';
                }
                // If tooltip is to the left of circle, arrow on right side
                else {
                  return `${tooltipWidth - 6}px`;
                }
              })(),
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderRight: hoveredPredictionPoint.x < 320 / 2 ? '6px solid #323130' : 'none',
              borderLeft: hoveredPredictionPoint.x >= 320 / 2 ? '6px solid #323130' : 'none'
            }}></div>
          </div>
        )}

        {/* Legend - interactive buttons with colored borders */}
        <div style={{...predictionLegendContainerStyles, gap: 10}}>
          {/* Won Opportunities Button */}
          <button
            onClick={() => setShowWonOpportunities(!showWonOpportunities)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 3px',
              border: `1px solid ${copilotColors.blue}`,
              borderRadius: '4px',
              backgroundColor: showWonOpportunities ? 'rgba(0, 120, 212, 0.1)' : 'transparent',
              cursor: 'pointer',
              fontSize: '11px',
              color: '#323130',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              ...predictionLineStyles,
              opacity: showWonOpportunities ? 1 : 0.3
            }} />
            <Text style={{ 
              fontSize: 11,
              opacity: showWonOpportunities ? 1 : 0.6
            }}>
              Won Opportunities
            </Text>
          </button>
          
          {/* Predicted Wins Button */}
          <button
            onClick={() => setShowPredictedWins(!showPredictedWins)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 3px',
              border: `1px solid ${copilotColors.purple}`,
              borderRadius: '4px',
              backgroundColor: showPredictedWins ? 'rgba(134, 97, 197, 0.1)' : 'transparent',
              cursor: 'pointer',
              fontSize: '11px',
              color: '#323130',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              ...predictionLineStyleWithColor,
              width: '15px',
              marginRight: '4px',
              opacity: showPredictedWins ? 1 : 0.3
            }} />
            <Text style={{ 
              fontSize: 11,
              opacity: showPredictedWins ? 1 : 0.6
            }}>
              Predicted Wins
            </Text>
          </button>
          
          {/* Trend Line Button */}
          <button
            onClick={() => setShowTrendLine(!showTrendLine)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 3px',
              border: `1px solid ${copilotColors.green}`,
              borderRadius: '4px',
              backgroundColor: showTrendLine ? 'rgba(16, 124, 16, 0.1)' : 'transparent',
              cursor: 'pointer',
              fontSize: '11px',
              color: '#323130',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{
              ...trendLineStyleWithColor,
              width: '15px',
              marginRight: '4px',
              opacity: showTrendLine ? 1 : 0.3
            }} />
            <Text style={{ 
              fontSize: 11,
              opacity: showTrendLine ? 1 : 0.6
            }}>
              Trend Line
            </Text>
          </button>
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