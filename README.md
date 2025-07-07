# Share Of Wallet PCF Component

A comprehensive PowerApps Component Framework (PCF) control that provides interactive geographic visualization and opportunity insights for Share of Wallet analysis using Azure Maps integration.

## Description

The Share of Wallet PCF component is a sophisticated business intelligence tool designed for Microsoft Dynamics 365 and Power Platform environments. It combines interactive map visualization with detailed opportunity analytics to provide comprehensive insights into business performance across different geographic regions.

### Key Capabilities

- **Interactive Azure Maps Integration**: Displays countries/regions with color-coded overlays based on revenue data
- **Using Multi-Dataset**: Handles Share of Wallet, Product, and Opportunity datasets simultaneously
- **Dynamic Opportunity Insights**: Displays AI predictions and analytics from Dataverse with confidence scoring
- **Real-time Data Visualization**: Charts, graphs, and KPIs that update based on user interactions
- **Responsive Design**: Optimized for various screen sizes and Power Platform environments

## Instructions

### Prerequisites

1. **Power Platform Environment** with PCF components enabled
2. **Azure Maps Subscription** and API key
3. **Microsoft Dynamics 365** or **Power Apps** environment
4. **Node.js** (v14 or higher) for development
5. **PowerApps CLI** installed

### Installation

#### Option 1: Import Solution (Recommended)

1. **Download Solution**
   - Download the managed solution: `ShareOfWallet_v1.0.0_Managed.zip`
   - Or download the unmanaged solution: `ShareOfWallet_v1.0.0_Unmanaged.zip`

2. **Import to Power Platform**
   - Navigate to [Power Platform Admin Center](https://admin.powerplatform.microsoft.com/)
   - Select your target environment
   - Go to **Solutions** > **Import solution**
   - Upload the downloaded solution file
   - Follow the import wizard and configure environment variables

3. **Configure Azure Maps**
   - Set your Azure Maps subscription key in the environment variables
   - Update any required connection references

#### Option 2: Build from Source

1. **Clone the Repository**
   ```bash
   git clone https://github.com/DanAakesen/ShareOfWallet.git
   cd ShareOfWallet
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Component**
   ```bash
   npm run build
   ```

4. **Deploy to Power Platform**
   ```bash
   pac pcf push --publisher-prefix <your-prefix>
   ```

### Configuration

#### Data Integration Requirements

> **Important**: This PCF component is a visualization and interaction layer only. It does not generate AI predictions, perform machine learning, or calculate analytics. All predictive data must be:
> 
> - Calculated by external analytics platforms (Azure ML, Power BI, custom data pipelines)
> - Integrated into Dataverse via data flows, Power Automate, or API integrations
> - Mapped to the appropriate opportunity and prediction fields
> - Kept up-to-date through scheduled data refresh processes

#### Required Parameters

- **Azure Maps Key**: Your Azure Maps subscription key
- **JSON Polygon Field**: Field containing GeoJSON polygon data for map regions
- **View Dataset**: Primary dataset containing Share of Wallet data with:
  - Country Field (Lookup)
  - Region Field (Lookup) 
  - Current Year Field (Currency)
  - Last Year Field (Currency)
  - YoY Percent Field (Decimal)
  - RGBA Color Overlay Field (Text)

#### Optional Parameters

- **Show Visual**: Enable/disable chart visualizations (default: true)
- **Show Card**: Enable/disable opportunity insight cards (default: true)
- **Show Countries Without Revenue**: Include countries with no revenue data (default: false)

#### Dataset Requirements

1. **Share of Wallet Dataset** (ViewDataset)
   - Geographic and revenue data
   - Country/region mappings
   - Year-over-year metrics

2. **Product Dataset** (ProductDataset)
   - Product performance by region
   - Revenue breakdowns
   - SOW lookup references

3. **Opportunity Dataset** (OpportunityDataset)
   - Active opportunities
   - Historical win/loss data
   - AI prediction scores (must be mapped from external analytics platform)
   - Confidence ratings (must be populated via data integration)

### Usage

1. **Add the Component** to your Model Driven App
2. **Configure Data Sources** pointing to your Dynamics 365 entities
3. **Set Azure Maps Key** in component properties
4. **Map Required Fields** to corresponding entity attributes
5. **Customize Display Options** based on your requirements

## Features

### 🗺️ Interactive Map Visualization

- **Azure Maps Integration**: High-performance map rendering with custom polygon overlays
- **Dynamic Coloring**: Countries/regions colored based on revenue performance
- **Click Interactions**: Click on map regions to view detailed insights
- **Responsive Zoom**: Auto-fit map bounds based on filtered data
- **Hover Effects**: Visual feedback on map interactions

### 📊 Opportunity Insights Card

The component features a sophisticated insight card with three main tabs:

#### **Active Tab**
- **Open Opportunities KPIs**: Total count, value, and average probability
- **Opportunity List**: Scrollable list with revenue, close dates, and win/loss ratios
- **Probability Indicators**: Color-coded progress bars based on win likelihood
- **Clickable Records**: Direct navigation to opportunity records

#### **Prediction Tab**
- **Revenue Prediction Chart**: Interactive SVG chart with multiple data series:
  - **Won Opportunities** (Blue solid line): Historical wins by year
  - **Predicted Wins** (Purple dashed line): AI predictions read from Dataverse
  - **Trend Line** (Green dotted line): Revenue trend analysis
- **Interactive Legend**: Toggle chart lines on/off
- **Hover Tooltips**: Detailed information with opportunity breakdowns
- **Outlier Detection**: Identifies opportunities requiring review with confidence levels (must be pre-calculated and stored in Dataverse)

#### **History Tab**
- **Historical Performance Metrics**: Total won/lost revenue and average deal size
- **Won/Lost Chart by Year**: Stacked bar chart showing performance over time
- **Win/Loss Ratio Visualization**: Performance indicators and success rates
- **Interactive Tooltips**: Detailed breakdowns on hover

### 📈 Advanced Analytics (Read from Dataverse)

> **Note**: This component does not generate AI predictions or analytics. All predictive data must be calculated by external analytics platforms or data pipelines and stored in Dataverse before being consumed by this component.

- **AI Prediction Display**: Visualizes machine learning insights for opportunity outcomes (requires external ML pipeline)
- **Outlier Detection Visualization**: Displays pre-calculated outlier flags for unusual opportunities
- **Confidence Score Display**: Shows reliability indicators for predictions (must be populated via data integration)
- **Trend Analysis Visualization**: Displays historical pattern recognition and forecasting data
- **YoY Growth Tracking**: Year-over-year performance comparisons based on stored calculations

### 🎛️ Interactive Controls

- **Country/Region Dropdowns**: Filter data by geographic criteria
- **Chart Toggles**: Show/hide different data series
- **Dynamic Filtering**: Real-time data updates based on selections
- **Responsive Grid**: Sortable data tables with trend indicators
- **Visual Legends**: Clear indicators for all chart elements

### 🎨 Modern UI/UX

- **Fluent UI Design**: Built with Microsoft's Fluent UI React components (@fluentui/react) for consistent design language
- **Fluent UI Components Used**:
  - **Text**: Typography and content display
  - **Stack & StackItem**: Layout and spacing management
  - **DetailsList**: Data grids with sorting and selection
  - **Dropdown**: Country and region selection controls
  - **IColumn**: Structured data table definitions
  - **ScrollablePane**: Efficient scrolling for large datasets
- **Copilot-Style Gradients**: Modern visual elements and color schemes
- **Responsive Layout**: Adapts to different screen sizes
- **Accessibility Support**: ARIA labels and keyboard navigation built into Fluent UI components
- **Smooth Animations**: Polished transitions and hover effects

### 🔧 Technical Features

- **TypeScript Implementation**: Type-safe development with full IntelliSense
- **React Components**: Modern component architecture with hooks and functional components
- **Fluent UI React**: Leverages @fluentui/react v8.122.1 for enterprise-grade UI components
- **Azure Maps SDK**: Professional mapping capabilities with azure-maps-control v3.5.0
- **Chart.js Integration**: Rich data visualization with Chart.js v4.4.7
- **PCF Framework**: Native Power Platform integration with Microsoft.PowerApps.MSBuild.Pcf
- **Multi-Dataset Processing**: Efficient data handling and relationships
- **Error Handling**: Robust error management and user feedback
- **Performance Optimization**: Efficient rendering and data processing

### 📱 Platform Integration

- **Power Apps Canvas**: Seamless integration with canvas applications
- **Power Apps Model-Driven**: Full support for model-driven apps
- **Dynamics 365**: Native integration with D365 entities
- **Power Platform**: Leverages platform security and data governance
- **Teams Integration**: Works within Microsoft Teams applications

### 🔒 Enterprise Ready

- **Security Compliance**: Follows Power Platform security models
- **Data Governance**: Respects organizational data policies
- **Scalable Architecture**: Handles large datasets efficiently
- **Audit Trail**: Tracks user interactions and data access
- **Multi-Environment**: Supports dev/test/production deployments
