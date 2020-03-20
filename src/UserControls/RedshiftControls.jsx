// import React from 'react';
// import PropTypes from 'prop-types';
//
// export default class RedshiftControls extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//     render() {
//         return (
//             <React.Fragment>
//                 <div className="col">
//                     <h4 id="text">Redshift Controls</h4>
//                     <div className="radiusText">
//                         <label htmlFor="radInitialSeparationDistanceRange" id="text">Initial Separation Distance</label>
//                     </div>
//                     <div className="initialSeparationDistanceInput">
//                         <form onSubmit={this.onSubmitInitialSeparationDistance.bind(this)}>
//                             <input
//                                 className="input"
//                                 type="number"
//                                 min={150}
//                                 max={250}
//                                 step={0.01}
//                                 value={this.state.holdInitialSeparationDistance}
//                                 onChange={this.changeValInitialSeparationDistance.bind(this)}
//                             />
//                         </form>
//                     </div>
//
//                     <div className="initialSeparationDistanceSlider">
//                         <input
//                             type="range"
//                             min={150}
//                             max={250}
//                             step={0.01}
//                             value={this.state.initialSeparationDistance}
//                             onChange={this.onInitialSeparationDistanceChange.bind(this)}
//                         />
//                     </div>
//
//                     <div className="radiusText">
//                         <label htmlFor="radExpansionRateRange" id="text">Galaxy Expansion Rate</label>
//                     </div>
//                     <div className="expansionRateInput">
//                         <form onSubmit={this.onSubmitExpansionRate.bind(this)}>
//                             <input
//                                 className="input"
//                                 type="number"
//                                 min={0.25}
//                                 max={10.00}
//                                 step={0.01}
//                                 value={this.state.holdExpansionRate}
//                                 onChange={this.changeValExpansionRate.bind(this)}
//                             />
//                         </form>
//                     </div>
//
//                     <div className="expansionRateSlider">
//                         <input
//                             type="range"
//                             min={0.25}
//                             max={10.00}
//                             step={0.01}
//                             value={this.state.expansionRate}
//                             onChange={this.onExpansionRateChange.bind(this)}
//                         />
//                     </div>
//                 </div>
//             </React.Fragment>
//         );
//     }
// }
//
// RedshiftControls.propTypes = {
//     onResetClick: PropTypes.func.isRequired
// }
//

