"use client"
import React, { Component } from "react";

import { Crisp } from "crisp-sdk-web";

class CrispChat extends Component {
    componentDidMount() {
        Crisp.configure("1707dfeb-d39b-4120-9974-e630b0eb543e");
    }

    render() {
        return null;
    }
}
export default CrispChat