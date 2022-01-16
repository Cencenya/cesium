import React, { Component } from 'react';

interface ModalBoxProps {
    ele: string
}
interface ModalBoxStates {

}
class ModalBox extends Component<ModalBoxProps, ModalBoxStates> {
    constructor(props: ModalBoxProps) {
        super(props)
    }
    componentDidMount() {
        let div = document.getElementById('diy-container');
    }
    render() {
        return (
            <div className="diy-container">
                {this.props.ele}
            </div>
        );
    }
}

export default ModalBox;