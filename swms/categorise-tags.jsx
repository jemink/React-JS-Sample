import React, {Component} from 'react'
import {Typography} from '@material-ui/core';
import NodeTag from "../graph/NodeTag";
import { colors } from '../constants.json';
import classNames from 'classnames';

export default class CategoriseTags extends Component {

    getCategoryClass = category => {
        let color = colors.filter(color => color.id === category.colorId)[0].class;
        return color;
    };

    tag = (isLeft) => {
        const {tagCategories, classes, nodeId} = this.props;

        let categoriedID = [];
        tagCategories.map((item, i) => {
            categoriedID.push({colorId: i, ...item});
        });
        let arrayThreshold = Math.ceil(tagCategories.length/2);
        return (
            <div className="top-node-tagging">
                {categoriedID.map((tagCategory, index) => (
                    (isLeft ? index < arrayThreshold : index >= arrayThreshold) && <div className={classes.padding} key={tagCategory.id}>
                        <div className={classes.displayFlex}>
                            <div className={classNames( 'color-tag',
                              `${this.getCategoryClass(tagCategory)}`
                            )}>
                                <span/>
                                <label>
                                    {tagCategory.name}
                                </label>
                            </div>
                        </div>
                         <NodeTag tagCategory={tagCategory} nodeId={nodeId} tagCategories={tagCategories}/>
                    </div>)
                )}
            </div>
        )
    };

    render() {
        return (
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                {this.tag(true)}
                {this.tag()}
            </div>
        )
    }
}
