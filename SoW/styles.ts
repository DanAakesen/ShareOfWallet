import { IStackStyles, IStackItemStyles, IDetailsRowStyles, IDetailsListStyles } from "@fluentui/react";
import { Overflow } from "@fluentui/react-components";
import { ChartOptions } from "chart.js";

// Main layout styles
export const stackStyles: IStackStyles = {
    root: {
        height: "75vh", // Full viewport height
        width: "100vw", // Full viewport width
        display: "flex",
        flexDirection: "row",
        overflow: "hidden", // Prevent scrollbars on the stack container
    },
};

export const mapContainerStyles: React.CSSProperties = {
    flex: "0 0 60%", // Take 60% of the width
    height: "100%", 
    overflow: "hidden", // Prevent any overflow for the map
    padding: "15px",
};

export const sidebarStyles: React.CSSProperties = {
    flex: "0 0 40%", // Take 40% of the width
    height: "100%", 
    backgroundColor: "#ffffff",
    padding: "10px",
    boxSizing: "border-box", // Prevent padding from adding to width
    overflow: "hidden", // Prevent scrollbars on the sidebar itself
};

// Dropdown styles
export const dropdownContainerStyles: React.CSSProperties = {
    width: "100%",
    marginBottom: "30px",
};

// Grid styles
export const totalsRowStyles: Partial<IDetailsRowStyles> = {
    root: {
        fontWeight: "bold", 
        borderBottom: "1px solid #ccc", 
        borderTop: "1px solid #ccc", 
        backgroundColor: "#f9f9f9", 
        cursor: 'default',
    },
};

export const clickableRowStyles: Partial<IDetailsRowStyles> = {
    root: {
        cursor: 'pointer',
    }
};

export const gridDetailListStyles: Partial<IDetailsListStyles> = {
    root: {
        height: "100%", 
        width: "100%",
        overflowX: "hidden"
    },
    headerWrapper: {
        width: "100%"
    },
    contentWrapper: {
        maxHeight: "calc(100% - 40px)", 
        width: "100%",
        overflowX: "hidden",
        paddingLeft: 8,
        paddingRight: 8
    }
};

export const gridRefContainerStyles: React.CSSProperties = {
    height: '100%',
    width: '100%'
};

// Trend box styles
export const trendBoxStyles = {
    base: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center", 
        borderRadius: "4px",
        padding: "2px 8px",
        marginLeft: "8px",
        fontSize: "12px",
        fontWeight: "bold",
        width: "120px", 
        textAlign: "center", 
    },
    green: {
        border: "1px solid green",
        color: "green",
    },
    orange: { 
        border: "1px solid orange",
        color: "orange",
    },
    red: {
        border: "1px solid red",
        color: "red",
    },
    icon: {
        display: "inline-block",
        width: "10px",
        height: "10px",
        marginRight: "6px",
        borderRadius: "50%",
    },
};

export const trendValueStyles: React.CSSProperties = {
    width: "50px",
    textAlign: "right"
};

export const trendBoxContainerStyles: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
};

export const parrentGridContainerStyles: IStackStyles = {
    root: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
};

export const gridContainerStyles: IStackStyles = {
    root: {
        flex: 1,
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden", // Prevent horizontal overflow
    },
};

export const gridHeaderStyles: React.CSSProperties = {
    flex: "none", // Prevent header from growing/shrinking
    overflow: "hidden", // Ensure no extra scroll for the header
};

export const gridBodyStyles: React.CSSProperties = {
    flex: 1, // Allow the rows to fill remaining space
    overflowY: "auto", // Enable vertical scrolling
};

// SidebarContent styles
export const sidebarStackStyles: IStackStyles = {
    root: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
};

// Sidebar section styles
export const topSectionStyles: IStackItemStyles = {
    root: {
        height: "8%"
    }
};

export const dropdownSectionStyles: IStackStyles = {
    root: {
        marginBottom: 10
    }
};

export const dropdownItemStyles: IStackItemStyles = {
    root: {
        width: "50%",
        paddingRight: 30
    }
};

export const middleSectionStyles: IStackItemStyles = {
    root: {
        height: "57%",
        overflowY: "hidden"
    }
};

export const bottomSectionStyles: IStackItemStyles = {
    root: {
        height: "45",
        width: "100%"
    }
};

export const chartContainerStyles: React.CSSProperties = {
    marginTop: 20,
    marginBottom: 10,
    width: "100%",
    height: 350
};

// Card styles
export const insightCardStyles = {
  root: {
    width: 400, // Increased width from 320 to 400
    maxWidth: '100%',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'absolute', // For positioning
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // More transparency (0.85 instead of 0.95)
    zIndex: 1000, // Ensure it appears above the map
    transition: 'all 0.2s ease-in-out',
    backdropFilter: 'blur(5px)', // Increased blur for better readability
  }
};

export const cardHeaderStyles = {
  root: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Added transparency to header
    borderBottom: '1px solid #f0f0f0',
    padding: '16px 20px 10px',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
    color: '#323130', // Dark text for contrast against white
  },
  countryText: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#0078d4', // Microsoft blue
    marginLeft: '4px',
  }
};

export const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#605e5c',
  transition: 'all 0.1s ease',
};

// New tab styles for the card
export const cardTabsStyles = {
  container: {
    display: 'flex',
    borderBottom: '1px solid #f0f0f0',
    padding: '0 16px',
  },
  tab: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    position: 'relative' as const, 
    color: '#605e5c',
  },
  activeTab: {
    color: '#0078d4', // Microsoft blue
    borderBottom: '2px solid #0078d4',
  },
  tabContent: {
    display: 'none',
    padding: '16px',
  },
  activeTabContent: {
    display: 'block',
  }
};

// Microsoft Copilot gradient colors
export const copilotColors = {
  gradient: 'linear-gradient(135deg, #0078D4 0%, #00BCF2 50%, #8661C5 100%)',
  blue: '#0078D4',
  lightBlue: '#00BCF2',
  purple: '#8661C5',
  darkPurple: '#5C2D91',
  green: '#107C10',
};

// Record Modal Styles
export interface IRecordModalStyles {
  container: React.CSSProperties;
  gradientBorder: React.CSSProperties;
  header: React.CSSProperties;
  headerText: React.CSSProperties;
  closeButton: React.CSSProperties;
  content: React.CSSProperties;
  spinnerContainer: React.CSSProperties;
  errorContainer: React.CSSProperties;
  errorText: React.CSSProperties;
  iframeContainer: React.CSSProperties;
  iframe: React.CSSProperties;
}

export const recordModalStyles: IRecordModalStyles = {
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    maxHeight: '85vh',
    width: '80vw',
    maxWidth: '90vw',
    minWidth: '800px'
  },
  gradientBorder: {
    height: '4px',
    background: copilotColors.gradient,
    position: 'relative',
    top: 0,
    left: 0,
    right: 0
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid #edebe9'
  },
  headerText: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#323130'
  },
  closeButton: {
    color: '#605e5c',
    marginLeft: 'auto'
  },
  content: {
    padding: '0',
    overflow: 'hidden',
    maxHeight: 'calc(85vh - 130px)',
    position: 'relative'
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  },
  errorContainer: {
    padding: '20px',
    color: '#a4262c'
  },
  errorText: {
    color: '#a4262c',
    fontSize: '14px'
  },
  iframeContainer: {
    width: '100%',
    height: 'calc(80vh - 140px)',
    minHeight: '600px',
    overflow: 'hidden',
    borderRadius: '0 0 2px 2px',
    display: 'flex'
  },
  iframe: {
    width: '100%',
    height: '100%',
    minWidth: '640px',
    minHeight: '600px',
    border: 'none',
    flexGrow: 1
  }
};

export const cardContentStyles = {
  root: {
    padding: '16px',
  },
  section: {
    marginBottom: '12px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '6px',
    color: '#323130',
  },
  sectionContent: {
    fontSize: '13px',
    color: '#605e5c',
  },
  highlight: {
    color: '#0078d4',
    fontWeight: 600,
  },
  metric: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  metricName: {
    fontSize: '13px',
    color: '#605e5c',
  },
  metricValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#323130',
  },
  positive: {
    color: 'green',
  },
  negative: {
    color: 'red',
  },
  neutral: {
    color: 'orange',
  },
};

/**
 * Helper function for stacked bar styles in charts
 */
export const getStackedBarStyles = (heightPercent: number, color: string, isHovered: boolean): React.CSSProperties => {
  return { 
    height: `${heightPercent}%`, 
    width: '70%',
    minHeight: heightPercent > 0 ? '2px' : '0',
    backgroundColor: color,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: isHovered ? '0 0 8px rgba(0, 0, 0, 0.3)' : 'none',
    transition: 'box-shadow 0.2s ease',
    cursor: 'pointer'
  };
};

// Chart styles
export const chartTitleStyles = {
  font: {
    size: 18,
    weight: 'bold' as const // Changed from 'bold' as 'bold' to 'bold' as const
  },
  padding: {
    top: 10,
    bottom: 15
  }
};

export const chartLegendStyles = {
  display: true,
  position: 'top' as const,
  labels: {
    font: {
      size: 14
    }
  }
};

export const chartOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: "Product Revenue by Country",
      font: chartTitleStyles.font,
      padding: chartTitleStyles.padding
    },
    legend: chartLegendStyles
  },
  scales: {
    x: {
      stacked: true, // Enable stacking for the x-axis
    },
    y: {
      stacked: true, // Enable stacking for the y-axis
      beginAtZero: true,
    }
  }
};

// Additional card styles for cleanup
export const barChartContainerStyles: React.CSSProperties = { 
  marginTop: 16, 
  marginBottom: 16 
};

export const yAxisLabelsContainerStyles: React.CSSProperties = { 
  position: 'absolute', 
  left: 0, 
  top: 0, 
  bottom: 0, 
  width: 50, 
  display: 'flex', 
  flexDirection: 'column', 
  justifyContent: 'space-between' 
};

export const yAxisLabelStyles: React.CSSProperties = { 
  fontSize: 9, 
  color: '#666' 
};

export const gridLineStyles: React.CSSProperties = { 
  position: 'absolute', 
  height: 1, 
  backgroundColor: '#f0f0f0' 
};

export const topGridLineStyles: React.CSSProperties = { 
  ...gridLineStyles, 
  top: 0, 
  left: 0, // Change from 50 to 0 to make grid lines start at the beginning
  right: 0 
};

export const middleGridLineStyles: React.CSSProperties = { 
  ...gridLineStyles, 
  top: '50%', 
  left: 0, // Change from 50 to 0 to make grid lines start at the beginning
  right: 0 
};

export const bottomGridLineStyles: React.CSSProperties = { 
  ...gridLineStyles, 
  bottom: 0, 
  left: 0, // Change from 50 to 0 to make grid lines start at the beginning
  right: 0 
};

export const barsContainerStyles: React.CSSProperties = { 
  position: 'absolute', 
  left: 50, 
  right: 0, 
  top: 0, 
  bottom: 0 
};

export const barsFlexContainerStyles: React.CSSProperties = { 
  display: 'flex', 
  height: '100%', 
  width: '100%', 
  justifyContent: 'space-around', 
  alignItems: 'flex-end' 
};

export const barItemStyles: React.CSSProperties = { 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  width: '30%',
  height: '100%',
  position: 'relative'
};

export const barGrowContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center', 
  height: '100%',
  width: '100%'
};

export const barValueStyles: React.CSSProperties = { 
  color: 'white',
  fontSize: 11,
  fontWeight: 500,
  textShadow: 'none' 
};

export const barTooltipStyles: React.CSSProperties = {
  position: 'absolute',
  bottom: '105%',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: '6px 10px',
  borderRadius: '4px',
  fontSize: '11px',
  whiteSpace: 'nowrap',
  zIndex: 10,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
};

export const tooltipTitleStyles: React.CSSProperties = { 
  fontWeight: 'bold', 
  marginBottom: '3px' 
};

export const tooltipArrowStyles: React.CSSProperties = { 
  position: 'absolute', 
  bottom: '-5px', 
  left: '50%', 
  marginLeft: '-5px', 
  width: 0, 
  height: 0, 
  borderLeft: '5px solid transparent', 
  borderRight: '5px solid transparent', 
  borderTop: '5px solid rgba(0, 0, 0, 0.8)' 
};

export const chartLegendContainerStyles: React.CSSProperties = { 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  marginTop: 30,
  backgroundColor: 'rgba(0, 0, 0, 0.02)',
  padding: '8px 12px',
  borderRadius: '4px'
};

export const chartLegendTextStyles: React.CSSProperties = { 
  fontSize: 11, 
  color: '#555' 
};

// Prediction Chart Styles
export const predictionChartContainerStyles: React.CSSProperties = { 
  position: 'relative', 
  height: 150, 
  marginLeft: 50, 
  marginRight: 10 
};

export const predictionAxisLabelsStyles: React.CSSProperties = { 
  position: 'absolute', 
  left: -50, 
  top: 0, 
  bottom: 0, 
  width: 50, 
  display: 'flex', 
  flexDirection: 'column', 
  justifyContent: 'space-between' 
};

export const predictionXAxisStyles: React.CSSProperties = { 
  position: 'absolute', 
  left: 0, 
  right: 0, 
  bottom: -25, 
  height: 20, 
  display: 'flex', 
  justifyContent: 'space-between' 
};

export const predictionXAxisLabelStyles = (position: number): React.CSSProperties => ({ 
  fontSize: 10, 
  position: 'absolute', 
  left: `${position}%`, 
  transform: 'translateX(-50%)' 
});

export const predictionLegendContainerStyles: React.CSSProperties = { 
  display: 'flex', 
  justifyContent: 'center', 
  marginTop: 30 
};

export const predictionLineStyles: React.CSSProperties = { 
  width: 20, 
  height: 3, 
  backgroundColor: copilotColors.blue, 
  marginRight: 4 
};

// Card Active Tab Styles
export const activeOpportunitiesContainerStyles: React.CSSProperties = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  marginBottom: 16,
  marginTop: 8,
  padding: '4px 0'
};

export const opportunityStatBoxStyles: React.CSSProperties = { 
  textAlign: 'center', 
  padding: '8px 6px',
  backgroundColor: 'rgba(0, 120, 212, 0.06)', 
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column'
};

export const opportunityStatLabelStyles: React.CSSProperties = { 
  fontSize: 12, 
  marginBottom: 2 
};

export const opportunityStatValueStyles: React.CSSProperties = { 
  fontSize: 22, 
  fontWeight: 600, 
  color: copilotColors.blue 
};

export const opportunitiesListContainerStyles: React.CSSProperties = { 
  height: '320px', 
  overflowY: 'auto',
  marginRight: '-8px',
  paddingRight: '8px',
  paddingBottom: '16px' 
};

export const opportunityItemStyles: React.CSSProperties = { 
  marginBottom: 16, 
  padding: 14, 
  backgroundColor: 'rgba(255,255,255,0.5)', 
  borderRadius: 8, 
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
};

export const opportunityHeaderStyles: React.CSSProperties = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center', 
  marginBottom: 10 
};

export const opportunityValueStyles: React.CSSProperties = { 
  fontSize: 15, 
  fontWeight: 600 
};

export const opportunityDetailsStyles: React.CSSProperties = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  fontSize: 12, 
  marginBottom: 10 
};

export const progressBarContainerStyles: React.CSSProperties = { 
  position: 'relative', 
  height: '5px', 
  width: '100%', 
  backgroundColor: '#f3f3f3', 
  borderRadius: '3px', 
  overflow: 'hidden'
};

export const getProgressBarStyles = (probability: number, color: string): React.CSSProperties => ({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: `${probability}%`,
  backgroundColor: color,
  borderRadius: '3px'
});

export const emptyStateStyles: React.CSSProperties = { 
  padding: '30px 20px', 
  textAlign: 'center',
  backgroundColor: 'rgba(255,255,255,0.5)',
  borderRadius: 8,
  marginTop: 20
};

// Outlier section styles
export const outlierContainerStyles: React.CSSProperties = { 
  border: `1px solid ${copilotColors.lightBlue}`, 
  borderRadius: '6px', 
  backgroundColor: 'rgba(0, 188, 242, 0.05)',
  padding: '12px'
};

export const outlierItemStyles = (isLast: boolean): React.CSSProperties => ({ 
  padding: '10px', 
  marginBottom: isLast ? 0 : '8px',
  borderBottom: isLast ? 'none' : '1px solid rgba(0, 188, 242, 0.2)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
});

export const outlierIndicatorStyles = (isLow: boolean): React.CSSProperties => ({ 
  display: 'inline-block',
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: isLow ? 'orange' : 'red',
  marginRight: 6
});

export const outlierConfidenceLabelStyles: React.CSSProperties = { 
  fontSize: 11, 
  color: '#666', 
  display: 'flex', 
  alignItems: 'center',
  marginTop: 4 
};

export const outlierFootnoteStyles: React.CSSProperties = { 
  marginTop: 8, 
  fontSize: 11, 
  color: '#666', 
  maxWidth: '100%', 
  wordWrap: 'break-word',
  whiteSpace: 'normal',
  padding: '0 4px'
};

export const outlierFootnoteTextStyles: React.CSSProperties = { 
  display: 'block', 
  lineHeight: 1.4,
  textAlign: 'left'
};

// Win/Loss visualization styles
export const winLossContainerStyles: React.CSSProperties = { 
  padding: '16px',
  backgroundColor: 'rgba(0, 120, 212, 0.04)',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

export const winLossHeaderStyles: React.CSSProperties = { 
  display: 'flex', 
  justifyContent: 'space-between',
  marginBottom: 6 
};

export const winLossBarContainerStyles: React.CSSProperties = { 
  height: 6, 
  width: '100%', 
  backgroundColor: 'rgba(255,255,255,0.6)',
  borderRadius: 3,
  overflow: 'hidden',
  position: 'relative'
};

export const getWinLossBarStyles = (ratio: number): React.CSSProperties => {
  const color = ratio >= 70 ? 
    copilotColors.green : 
    ratio >= 50 ? 
      copilotColors.blue : 
      copilotColors.purple;
      
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: `${ratio}%`,
    backgroundColor: color
  };
};

export const winLossSummaryStyles: React.CSSProperties = { 
  display: 'flex', 
  justifyContent: 'space-between', 
  marginBottom: 8 
};

export const winLossVisualizationStyles: React.CSSProperties = {
  display: 'flex',
  height: 60,
  overflow: 'hidden',
  borderRadius: 6,
};

export const wonSectionStyles: React.CSSProperties = {
  backgroundColor: 'rgba(16, 124, 16, 0.15)',
  borderRight: '1px solid rgba(255,255,255,0.5)',
  padding: '8px 10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

export const lostSectionStyles: React.CSSProperties = {
  backgroundColor: 'rgba(134, 97, 197, 0.15)',
  padding: '8px 10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

export const wonCountStyles: React.CSSProperties = { 
  fontSize: 18, 
  fontWeight: 600, 
  color: copilotColors.green 
};

export const lostCountStyles: React.CSSProperties = { 
  fontSize: 18, 
  fontWeight: 600, 
  color: copilotColors.purple 
};

export const winLossLabelStyles: React.CSSProperties = { 
  fontSize: 10, 
  color: '#555' 
};

// Circular progress indicator style
export const circularProgressStyle: React.CSSProperties = {
  width: 60,
  height: 60,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  fontWeight: 600,
  position: 'relative',
  margin: '0 auto 12px',
  border: '4px solid #f3f3f3',
};

export const getCircularProgressStyles = (ratio: number): React.CSSProperties => ({
  ...circularProgressStyle,
  borderTop: `4px solid ${ratio >= 70 ? copilotColors.green : ratio >= 50 ? copilotColors.blue : copilotColors.purple}`,
  transform: 'rotate(-45deg)'
});

export const circularValueStyles: React.CSSProperties = { 
  transform: 'rotate(45deg)' 
};

export const winLossRatioLabelStyles: React.CSSProperties = { 
  fontSize: 13, 
  fontWeight: 600 
};

export const winLossRatioContainerStyles: React.CSSProperties = { 
  textAlign: 'center', 
  padding: '8px 0' 
};

// Style for clickable opportunity names
export const clickableNameStyle: React.CSSProperties = {
  fontSize: 15, 
  fontWeight: 600,
  color: copilotColors.blue,
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'color 0.2s ease'
};

// Create helper functions for generating trend and prediction line backgrounds
export const getTrendLineBackground = (color: string): string => {
  return `repeating-linear-gradient(90deg, ${color}, ${color} 4px, transparent 4px, transparent 7px)`;
};

export const getPredictionLineBackground = (color: string): string => {
  return `repeating-linear-gradient(90deg, ${color}, ${color} 6px, transparent 6px, transparent 9px)`;
};

// Trend line style with hard-coded color
export const trendLineStyle: React.CSSProperties = {
  width: 25,
  height: 3,
  backgroundColor: 'transparent',
  marginRight: 8,
  backgroundImage: `repeating-linear-gradient(90deg, #107C10, #107C10 4px, transparent 4px, transparent 7px)`
};

// Prediction line style with hard-coded color
export const predictionLineStyle: React.CSSProperties = {
  width: 25,
  height: 3,
  backgroundColor: 'transparent',
  marginRight: 8,
  backgroundImage: `repeating-linear-gradient(90deg, #8661C5, #8661C5 6px, transparent 6px, transparent 9px)`
};

// Card style for positioning
export const getCardStyle = (position: { x: number; y: number }, isVisible: boolean, styles: any): React.CSSProperties => {
  return {
    width: styles.root.width,
    maxWidth: styles.root.maxWidth,
    boxShadow: styles.root.boxShadow,
    borderRadius: styles.root.borderRadius,
    overflow: styles.root.overflow,
    position: 'absolute',
    backgroundColor: styles.root.backgroundColor,
    backdropFilter: styles.root.backdropFilter,
    zIndex: styles.root.zIndex as number,
    transition: styles.root.transition,
    left: position.x,
    top: position.y,
    display: isVisible ? 'block' : 'none'
  };
};

// Gradient border style for Copilot-inspired look
export const gradientBorderStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '4px',
  background: copilotColors.gradient
};



