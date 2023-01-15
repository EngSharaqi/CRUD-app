// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** components
import SpinnerLoading from '../../../components/spinner'

// ** Reactstrap Imports
import { Row, Col, Card, CardBody, Table } from 'reactstrap'

import axios from '../../../../liberary/helpers/axios'

export default function View() {
    const [allVariantsViewData, setAllProductViewData] = useState([])
    const [loading, setLoading] = useState(false)

    const dynamicID = window.location.pathname.split('/').reverse()[0]
    useEffect(() => {
        axios.get(`/variant/view/${dynamicID}`)
            .then(res => {
                setLoading(true)
                setAllProductViewData(res.data.data)
            })
            .catch(error => {
                window.localStorage.clear()
                window.location.href = '/login'
            })
    }, [])

    return (
        <Fragment>
            <Row>
                {/* Product details */}
                <Col sm={6} md={5} lg={4} xs={12}>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col md={12} xs={12}>
                                    {
                                        loading == false ? <SpinnerLoading /> :
                                            allVariantsViewData == '' ? <p style={{ 'width': '100%', 'text-align': 'center', 'padding': '20px 5px' }}>No data to show</p> :
                                                <div>
                                                    <Row>
                                                        <h4 style={{ 'margin': '40px auto 25px', 'textAlign': 'center' }}>Brand details</h4>
                                                    </Row>
                                                    <Row>
                                                        <p style={{ 'text-align': 'left' }}><span><b>ID: </b></span><span>{allVariantsViewData.id}</span></p>
                                                        <p style={{ 'text-align': 'left' }}><span><b>Product SKU: </b></span><span>{allVariantsViewData.product_sku}</span></p>
                                                        <p style={{ 'text-align': 'left' }}><span><b>Price: </b></span><span>{allVariantsViewData.price}</span></p>
                                                        <p style={{ 'text-align': 'left' }}><span><b>Image: </b></span><span><img src={allVariantsViewData.image} /></span></p>
                                                        <p style={{ 'text-align': 'left' }}><span><b>Status: </b></span><span>{allVariantsViewData.status}</span></p>
                                                        <p style={{ 'text-align': 'left' }}><span><b>Stock: </b></span><span>{allVariantsViewData.stock}</span></p>
                                                        <p style={{ 'text-align': 'left' }}><span><b>Product ID: </b></span><span>{allVariantsViewData.product_id}</span></p>
                                                        
                                                    </Row>
                                                </div>
                                    }
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>

                {/* Product details */}
                <Col sm={7} md={7} lg={8} xs={12}>
                    <Card>
                        <CardBody className='v-card v-theme--light v-card--density-default v-card--variant-elevated'>
                            <Row>
                                <Col md={12} xs={12}>
                                    {
                                        loading == false ? <SpinnerLoading /> :
                                            allVariantsViewData == '' ? <p style={{ 'width': '100%', 'text-align': 'center', 'padding': '20px 5px' }}>No data to show</p> :
                                                <div>
                                                    <Row>
                                                        <h4 style={{ 'margin': '40px auto 25px', 'textAlign': 'center' }}>Product Attributes</h4>
                                                    </Row>
                                                    <Row>
                                                        <div className=' table-responsive'>
                                                            <Table className='table table-striped'>
                                                                <thead className='thead-light'>
                                                                    <tr>
                                                                        <td>ID</td>
                                                                        <td>Name</td>
                                                                        <td>Value</td>
                                                                        <td>Variant ID</td>
                                                                    </tr>
                                                                </thead>

                                                                <tbody>
                                                                    {
                                                                        allVariantsViewData.attributes.map(attribute =>
                                                                                <tr key={attribute.id}>
                                                                                    <td>{attribute.id}</td>
                                                                                    <td>{attribute.name}</td>
                                                                                    <td>{attribute.value}</td>
                                                                                    <td>{attribute.variant_id}</td>
                                                                                </tr>

                                                                            )
                                                                    }
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </Row>
                                                </div>
                                    }
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col> 
            </Row>
        </Fragment>
    )
}
