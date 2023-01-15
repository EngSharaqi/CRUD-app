// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** components
import SpinnerLoading from '../../../components/spinner'

// ** Third Party Components
import toast from 'react-hot-toast'
import * as Icons from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Row, Col, Card, Form, CardBody, Button, Input, Label, FormGroup, Table } from 'reactstrap'

import custAxios from '../../../../liberary/helpers/axios'
import axios from 'axios'

export default function Variants() {
    // get text from Name and pass it to Slug
    const [allVariantsData, setAllVariantsData] = useState([])
    const [selectedEditId, setSelectedEditId] = useState('')
    const [imageFile, setImageFile] = useState(null)
    const [deleted, setDeleted] = useState(null)
    const [VariantsUpdated, setVariantsUpdated] = useState(null)
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        custAxios.get(`/variant/get?page=${currentPage}`)
            .then(res => {
                setLoading(true)
                setAllVariantsData(res.data.data)
            })
            .catch(error => {
                window.localStorage.clear()
                window.location.href = '/login'
            })
    }, [deleted, VariantsUpdated, currentPage])


    let handleActions = (e) => {
        let variantProductID = document.getElementById('variantProductID'),
            variantProductSKU = document.getElementById('variantProductSKU'),
            variantPrice = document.getElementById('variantPrice'),
            variantStock = document.getElementById('variantStock'),
            variantStatusActive= document.getElementById('variant_status_active'),
            // saveBtn = document.querySelector('#saveBtn'),
            updateBtn = document.querySelector('#updateBtn')

        if (e.target.value == 'delete') {
            let __id = e.target.id
            setLoading(false)
            custAxios.delete(`/variant/delete/${__id}`).then(res => {
                setLoading(false)
                setDeleted(res)

                toast(() => (
                    <div className='d-flex'>
                        <div className='me-1'>
                            <Avatar size='sm' color='success' icon={<Icons.Check size={12} />} />
                        </div>
                        <div className='d-flex flex-column'>
                            <h6 className='toast-title'>Variant has been deleted successfuly!</h6>
                        </div>
                    </div>
                ))
            }).catch('The new category')
        }

        if (e.target.value == 'edit') {
            // show buttons buttons
            // saveBtn.classList.add('d-none')

            updateBtn.classList.remove('d-none')
            setSelectedEditId(e.target.id)
            setImageFile(null)

            variantProductID.value = e.target.getAttribute('variantProductID')
            variantProductSKU.value = e.target.getAttribute('product_sku')
            variantPrice.value = e.target.getAttribute('price')
            variantStock.value = e.target.getAttribute('stock')
            e.target.getAttribute('status') == 'Active' ? variantStatusActive.checked = true : document.getElementById('variant_status_InActive').checked = true

        } else {
            updateBtn.classList.add('d-none')
        }
    }

    let handleUpdateVariant = () => {
        let variantProductID = document.getElementById('variantProductID'),
            variantProductSKU = document.getElementById('variantProductSKU'),
            variantPrice = document.getElementById('variantPrice'),
            variantStock = document.getElementById('variantStock'),
            variantStatusActive= document.getElementById('variant_status_active')

        setLoading(false)


        const params = JSON.stringify({
            "product_id": variantProductID.value,
            "product_sku": variantProductSKU.value,
            "price": variantPrice.value,
            "stock": variantStock.value,
            "image":imageFile,
            "status": variantStatusActive.checked == true ? 'Active':'InActive',
            
        })

        const URL = 'https://api-ecommerce.snapysell.com'
        const instance = axios.create({
            baseURL: `${URL}/api`,
            headers: localStorage.getItem("token") ? {
                "content-type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            } : {}
        })

        instance.post(`/variant/update/${selectedEditId}`, params).then(res => {
            setLoading(false)
            setVariantsUpdated(res)

            toast(() => (
                <div className='d-flex'>
                    <div className='me-1'>
                        <Avatar size='sm' color='success' icon={<Icons.Check size={12} />} />
                    </div>
                    <div className='d-flex flex-column'>
                        <h6 className='toast-title'>Variant has been updated successfuly!</h6>
                    </div>
                </div>
            ))
        }).catch(error => {
            toast(() => (
                <div className='d-flex'>
                    <div className='me-1'>
                        <Avatar size='sm' color='danger' icon={<Icons.X size={12} />} />
                    </div>
                    <div className='d-flex flex-column'>
                        <h6 className='toast-title'>Failed to update Variant!</h6>
                    </div>
                </div>
            ))
        })
    }


    return (
        <Fragment>
            <Row>
                <Col md={12} xs={12}>
                    <Card>
                        <CardBody>
                            <h4 style={{ 'margin': '40px auto 25px', 'textAlign': 'center' }}>Variants</h4>
                            <Row>
                                <Col md={12} xs={12}>
                                    {
                                        loading == false ? <SpinnerLoading /> :
                                            allVariantsData == '' ? <p style={{ 'width': '100%', 'text-align': 'center', 'padding': '20px 5px' }}>No data to show</p> :
                                                <div>
                                                    <div className=' table-responsive'>
                                                        <Table className='table table-striped'>
                                                            <thead>
                                                                <tr>
                                                                    <td>View</td>
                                                                    <td>ID</td>
                                                                    <td>Product SKU</td>
                                                                    <td>Price</td>
                                                                    <td>Image</td>
                                                                    <td>Status</td>
                                                                    <td>Stock</td>
                                                                    <td>Product ID</td>
                                                                    <td>Actions</td>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                {
                                                                    allVariantsData?.data?.map(res =>
                                                                        <tr key={res.id}>
                                                                            <td><a href={`/products/variants/${res.id}`}><Icons.Eye size={20} /></a></td>
                                                                            <td>{res?.id}</td>
                                                                            <td>{res?.product_sku}</td>
                                                                            <td>{res?.price}</td>
                                                                            <td>{res?.image}</td>
                                                                            <td>{res?.status}</td>
                                                                            <td>{res?.stock}</td>
                                                                            <td>{res?.product_id}</td>

                                                                            <td>
                                                                                <select
                                                                                    onChange={handleActions}
                                                                                    className='form-select'
                                                                                    id = {res.id}
                                                                                    product_sku = {res?.product_sku}
                                                                                    price = {res?.price}
                                                                                    image = {res?.image}
                                                                                    status = {res?.status}
                                                                                    stock = {res?.stock}
                                                                                    variantProductID = {res?.product_id}
                                                                                >
                                                                                    <option selected>Select</option>
                                                                                    <option value='edit'>Edit</option>
                                                                                    <option value='delete'>Delete</option>
                                                                                </select>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                }
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </div>
                                    }
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>

                <Col md={12} xs={12}>
                    <Card>
                        <CardBody>
                            <div className='text-center mb-2'>
                                <h5 className='mb-1'>Edit Variant</h5>
                            </div>
                            <Form onSubmit={(e) => e.preventDefault()}>
                                <Row className='gy-1 pt-75'>
                                    <Col md={6} xs={12}>
                                        <Label className='form-label' for='variantProductID'>
                                        Product ID <span className='text-danger'>*</span>
                                        </Label>
                                        <Input
                                            type='text'
                                            id='variantProductID'
                                            placeholder='1'
                                            required
                                        />
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <Label className='form-label' for='variantProductSKU'>
                                        Product SKU <span className='text-danger'>*</span>
                                        </Label>
                                        <Input
                                            type='text'
                                            id='variantProductSKU'
                                            placeholder='Variant'
                                            required
                                        />
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <Label className='form-label' for='variantPrice'>
                                        Price <span className='text-danger'>*</span>
                                        </Label>
                                        <Input
                                            type='number'
                                            id='variantPrice'
                                            placeholder='100'
                                            required
                                        />
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <Label className='form-label' for='variantStock'>
                                        Stock <span className='text-danger'>*</span>
                                        </Label>
                                        <Input
                                            type='number'
                                            id='variantStock'
                                            placeholder='stock_title'
                                            required
                                        />
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <Label className='form-label' for='productStatus'>
                                            Status <span className='text-danger'>*</span>
                                        </Label>
                                        <FormGroup>
                                            <Label style={{ 'display': 'Inline-block', 'margin': '0 15px 0 0' }}>
                                                <Input type="radio" id='variant_status_active' class="form-check-input" name="product_status" checked /> Active
                                            </Label>
                                            <Label style={{ 'display': 'Inline-block', 'margin': '0 15px 0 0' }}>
                                                <Input type="radio" id='variant_status_InActive' class="form-check-input" name="product_status" /> InActive
                                            </Label>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6} xs={12}>
                                        <Label className='form-label' for='productMetaImageBinary64'>
                                            Image <span className='text-danger'>*</span>    
                                        </Label>
                                        <Input
                                            type='file'
                                            id='categoryImg'
                                            placeholder='Choose an image'
                                            onChange={(e) => {
                                                let files = e.target.files;
                                                let reader = new FileReader();
                                                reader.readAsDataURL(files[0]);

                                                reader.onload = (b) => {
                                                    setImageFile(b.target.result)
                                                }
                                            }}
                                        />
                                    </Col>
                                    <div className='d-flex justify-content-center pt-2'>
                                        <Button type='submit' color='primary' className='d-none' id='updateBtn' onClick={handleUpdateVariant}>Update</Button>
                                    </div>
                                </Row>
                            </Form>

                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
