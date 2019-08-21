import React, {Component} from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import {getNodesByType, getNodeSchema, isAuthorised} from "../../selectors/graphSelectors";
import {createNode, getAllNodes, deleteNode} from "../../actions";
import {connect} from "react-redux";
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import {Link, withRouter} from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Delete from "@material-ui/icons/Delete"
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from '@material-ui/icons/Close';

class SwmsList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            openSnackbar:false
        };

        this.handleAddClicked = this.handleAddClicked.bind(this);
    }

    componentDidMount() {
        if (this.props.swmsNodes.length === 0) {
            this.props.getAllNodes();
        }
    }

    handleAddClicked() {
        let {swmsSchema} = this.props;
        let event = this.props.onCreateNode(swmsSchema);
        this.props.history.push('/swms/' + event.payload.node.id);
    }

    handleCloseSnackbar = () => {
        this.setState({
            openSnackbar: false,
            snackbarMsg: '',
        });
    };

    handleDelete=(e, swms)=> {
        this.props.deleteNode(swms).then((res) => {
        }).catch((err) => {
           this.setState({
                openSnackbar: true,
                snackbarMsg: err.data ? err.data.message : 'Please check your connectivity'
            })
        })
    };

    render() {
        let {classes, swmsNodes, enableAddButton} = this.props;
        return (
            <div>
                <Snackbar
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                    open={this.state.openSnackbar}
                    onClose={this.handleCloseSnackbar}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    autoHideDuration={3000}
                    style={{height: 250}}
                    message={<span id="message-id">{this.state.snackbarMsg}</span>}
                    action={[
                        <IconButton
                            key="close"
                            aria-label="Close"
                            color="primary"
                            onClick={this.handleCloseSnackbar}
                        >
                            <CloseIcon/>
                        </IconButton>
                    ]}
                />
                <div className={classes.displayFlex}>
                <Typography className={classes.flexGrow} variant="h6" color="inherit" noWrap>
                    SWMS
                </Typography>
                    { enableAddButton &&(<Button
                        onClick={this.handleAddClicked}
                        color='primary'
                        variant='contained'
                    >Add New
                    </Button>)
                    }</div>

                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.columnHeader}>SWMS Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {swmsNodes.map(swms => (
                            <TableRow key={swms.id}>
                                <TableCell className={classes.tableCellBody}>
                                    <Link className={classes.addLink} to={`/swms/${swms.id}`}>{swms.name}</Link>
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={(e)=>this.handleDelete(e, swms)}><Delete/></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {swmsNodes.length!==0 && enableAddButton && (<div className={classes.add}>
                <Button onClick={this.handleAddClicked} color='primary' variant='contained' >Add New</Button>
                </div>)}
                </div>
        )
    }
}

const styles = (theme) => ({
    displayFlex:{
        display:'flex',
        marginBottom: 20
    },
    add:{
        display:'flex',
        marginTop:30,
        justifyContent:'flex-end'
    },
    addLink: {
        textDecoration: 'none',
        fontSize: 26,
        fontWeight: 500,
        lineHeight: 'normal',
        letterSpacing: 0,
        color: theme.palette.primary.main
    },
    flexGrow:{
        flexGrow:1,
        fontSize: 26,
        fontWeight: 600,
        lineHeight: 'normal',
        letterSpacing: 0,
        color: theme.palette.common.black
    },
    columnHeader:{
        borderBottom: `2px solid ${theme.palette.secondary.main}`,
        padding: '14px 56px 0 10px',
        fontSize: 16,
        fontWeight: 'normal',
        lineHeight: 'normal',
        letterSpacing: 0,
        color: theme.palette.secondary.contrastText,
        fontFamily: 'SofiaPro-Regular',
    },
    tableCellBody:{
        borderBottom: `2px solid ${theme.palette.secondary.main}`,
        padding: '14px 56px 16px 10px',
    }
});
SwmsList.propTypes = {};
const mapStateToProps = (state) => {
    let props = {
        swmsNodes: getNodesByType(state, 'SWMSRoot'),
        swmsSchema: getNodeSchema(state, 'SWMSRoot'),
        enableAddButton: isAuthorised(state, 'manage:SWMS')
    };
    return props;
};
const mapDispatchToProps = (dispatch) => {
    return {
        onCreateNode: node => dispatch(createNode(node)),
        getAllNodes: () => dispatch(getAllNodes()),
        deleteNode : (node) => dispatch(deleteNode(node))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(SwmsList)));
