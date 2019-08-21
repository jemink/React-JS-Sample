import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import {getNode, getNodesByType, isAuthorised} from "../../selectors/graphSelectors";
import {connect} from "react-redux";
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import NodeTextField from "../graph/NodeTextField";
import GridTable from "./GraphTable";
import GraphSave from "../graph/GraphSave";
import NodeTag from "../graph/NodeTag";
import {sendSWMS} from './../../actions/';
import SwmsEmail from './SwmsEmail';
import CategoriseTags from "../components/categorise-tags";

class SwmsShow extends Component {
    constructor(props) {
        super(props);

        this.state = {
          sendSWMSVisible: false,
          email: '',
          openSnackbar: false,
          snackbarMsg: '',
          isLoad: false,
          isError:false,
            value:false

        };
    }

    onSWMSModal = () => {
      const {sendSWMSVisible} = this.state;
      this.setState({sendSWMSVisible: !sendSWMSVisible});
    }

    onSendSWMS = (email) => {
      let {swmsNode, sendSWMS} = this.props;
      let payload = {
        swmsId: swmsNode.id,
        emailId: email
      };
      let validEmail=email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        if(email !== "" && validEmail!=null) {
            this.setState({isLoad: true});

            sendSWMS && sendSWMS(payload).then(() => {
                this.setState({
                    sendSWMSVisible: false,
                    openSnackbar: true,
                    snackbarMsg: 'Email successfully send...!',
                    isLoad: false,
                    email: ''
                });
            }).catch(() => {
                this.setState({
                    sendSWMSVisible: false,
                    openSnackbar: true,
                    snackbarMsg: 'Some error occured...!',
                    isLoad: false,
                    email: ''
                });
            });
        }else{
            this.setState({
                isLoad: false,
                email: '',
                isError: true
            });
        }
    }

    handleCloseSnackbar = () => {
      this.setState({openSnackbar: false});
    }

    handleChange = () => {
        this.setState({isError: false});
    }

    handleValueChange = () => {
        debugger
        this.setState({value: true});
    }

    render() {
        let {classes, swmsNode, tagCategories, selectedTags, node, showEditButtons} = this.props;
        let {sendSWMSVisible, isLoad, openSnackbar, snackbarMsg} = this.state;

        if (!swmsNode) {
            return <span>SWMS not found</span>;
        }
        return (
            <div>
                <Typography className={`${classes.headline} ${classes.firstTitle}`} variant="body1" color="primary" noWrap>
                    SWMS
                </Typography>
                <div className={`${classes.displayFlex} ${classes.marginBottom}`}>
                    <Typography variant="h5" className={`${classes.headline} ${classes.flexGrow}`} gutterBottom>
                        {swmsNode.name}
                    </Typography>
                    <Button variant="contained" color="primary" onClick={this.onSWMSModal} className={classes.swmsButton} disabled={!showEditButtons}>
                      <span> Send SWMS</span>
                    </Button>
                    <GraphSave type={"swms"} showEditButtons={showEditButtons} value={this.state.value} handleValueChange={this.handleValueChange} />
                </div>
                <NodeTextField nodeId={swmsNode.id} nodePropertyName={'name'}/>
                <NodeTextField nodeId={swmsNode.id} nodePropertyName={'imsNo'}/>
                <CategoriseTags
                  tagCategories={tagCategories}
                  classes={classes}
                  nodeId={swmsNode.id}
                />
                <Typography className={`${classes.title} ${classes.activityHeader}`} variant="h6" color="inherit" noWrap>
                    Activities
                </Typography>
                <GridTable rootNodeId={swmsNode.id} displayOptionId='AHRC'
                           availableDisplayOptionIds={['AHRC', 'CRHA', 'HRC|A']} mode='edit'
                            tagCategories={tagCategories}
              />
                <GraphSave showEditButtons={showEditButtons}/>
                <SwmsEmail
                  sendSWMSVisible={sendSWMSVisible}
                  isLoad={isLoad}
                  openSnackbar={openSnackbar}
                  snackbarMsg={snackbarMsg}
                  handleCloseSnackbar={this.handleCloseSnackbar}
                  onSwmsModal={this.onSWMSModal}
                  onSendSWMS={(value) => this.onSendSWMS(value)}
                  isError={this.state.isError}
                  handleChange={this.handleChange}
                />
            </div>
        )
    }
}

const styles = (theme) => ({
    headline: {fontWeight: 800},
    marginBottom:{ marginBottom: 30},
    firstTitle: {fontWeight: 500,
        fontSize: 18,
        lineHeight: 'normal',
        letterSpacing: 0,
        color: theme.palette.primary.main,
        marginBottom: 5,
    },
    displayFlex: {
        display: 'flex'
    },
    swmsButton:{
        marginRight:10
    },
    flexGrow: {flexGrow: 2,
        fontSize: 26,
        fontWeight: 500,
        lineHeight: 'normal',
        letterSpacing: 0,
        color: '#28374a',
    },
    colorTags: {
      color: theme.palette.secondary.contrastText,
      fontSize: '14px',
      fontWeight: 'bold',
      marginLeft: '4px'
    },
    padding:{
      padding: '10px 0 5px'
    },
    activityHeader: {
        fontSize: 26,
        fontWeight: 500,
        lineHeight: 'normal',
        letterSpacing: 0,
        color: '#28374a',
        marginTop: 20,
    },
});
SwmsShow.propTypes = {};
const mapStateToProps = (state, ownProps) => {
    let nodeId = ownProps.match.params.id;
    let node = getNode(state, nodeId);

    let props = {
        swmsNode: getNode(state, nodeId),
        tagCategories: getNodesByType(state, 'TagCategory'),
        node: node,
        showEditButtons: isAuthorised(state, 'manage:SWMS')
    };
    return props;
};
const mapDispatchToProps = (dispatch) => {
    return {
      sendSWMS: (payload)=>dispatch(sendSWMS(payload))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SwmsShow));
