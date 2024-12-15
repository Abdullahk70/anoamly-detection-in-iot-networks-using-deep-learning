import React from 'react'
import Sidebar from './sideBar'
import Home from './Home'
import DataUpload from './DataUpload'
import NormalizationScaling from './NormalizationScaling'
import FeatureSelectionPage from './FeatureSelectionPage'
import Encoding from './Encoding'
import Visualization from './Visualization'
import OutlierDetection from './OutlierDetection'
import DataSplitting from './DataSplitting'
import ExportData from './ExportData'

const HomeScreen = (props) => {
  return (
    <div className="flex">
    {/* Sidebar */}
    <Sidebar />
    <div className='w-full'>
    {props.screen=="Home" && <Home/>}
    {props.screen=="upload" && <DataUpload/>}
    {props.screen=="normalization" && <NormalizationScaling/>}
    {props.screen=="feature-selection" && <FeatureSelectionPage/>}
    {props.screen=="encoding" && <Encoding/>}
    {props.screen=="outlier-detection" && <OutlierDetection/>}
    {props.screen=="visualization" && <Visualization/>}
    {props.screen=="data-splitting" && <DataSplitting/>}
    {props.screen=="export-data" && <ExportData/>}
    </div>
  </div>
  )
}

export default HomeScreen
