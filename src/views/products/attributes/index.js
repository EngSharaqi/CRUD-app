// ** React Imports
import { useState, Fragment, useEffect } from 'react'

// ** components
import SpinnerLoading from '../../components/spinner'

// ** Third Party Components
import classnames from 'classnames'
import toast from 'react-hot-toast'
import * as Icons from 'react-feather'
import { CopyToClipboard } from 'react-copy-to-clipboard'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Row, Col, Card, Form, CardBody, Button, Input, Label, FormGroup, Table, Modal, ModalHeader, ModalBody, InputGroup, InputGroupText, UncontrolledTooltip } from 'reactstrap'

import axios from '../../../liberary/helpers/axios'

export default function Attribute () {
    // get text from Name and pass it to Slug
    const [allCategoriesData, setAllAttributesData] = useState([])
    const [selectedEditId, setSelectedEditId] = useState('')
    const [show, setShow] = useState(false)
    const [showData, setShowData] = useState([])
    const [allAttributesDataAlt, setAllAttributesDataAlt] = useState([])
    const [file, setFile] = useState(null)
    const [iconName, setIconName] = useState('')
    const [deleted, setDeleted] = useState(null)
    const [categoryAdded, setCategoryAdded] = useState(null)
    const [categoryUpdated, setCategoryUpdated] = useState(null)
    const [loading, setLoading] = useState(false)

    let handleChangeName = (e) => {
        document.getElementById('AttributeDescription').value = e.target.value
    }

    let handleSearch = (e) => {
        if (e.target.value != '') {
            axios.get(`/categories/search?search=${e.target.value}`).then(res => {
                if (e.target.value != '') {
                    setAllAttributesData(res.data.data.data)
                } else {
                    setAllAttributesData(allAttributesDataAlt)
                }
            })
        }
    }

    useEffect(() => {
        axios.get('/categories/get')
        .then(res => {
            setLoading(true)
            setAllAttributesData(res.data.data.data)
            setAllAttributesDataAlt(res.data.data.data)
        })
        .catch(error => {
            window.localStorage.clear()
            window.location.href = '/login'
        })
    }, [deleted, categoryAdded, categoryUpdated])
  
    // end icons settings
    const isAddSubChecked = (e) => {
        if (e.target.checked) {
            e.target.parentNode.parentNode.querySelector('select').classList.remove('d-none')
            e.target.parentNode.parentNode.querySelector('.subCategoryLabel').classList.remove('d-none')
            // subCategoryLabel
        } else {
            e.target.parentNode.parentNode.querySelector('select').classList.add('d-none')
            e.target.parentNode.parentNode.querySelector('.subCategoryLabel').classList.add('d-none')
        }
    }
    let handleAddCategory = () => {
        let AttributeName = document.getElementById('AttributeName'),
            searchable_status = document.getElementById('searchable_status'),
            status_active = document.getElementById('status_active'),
            subCatSelect = document.getElementById('subCatSelect'),
            categoryIcon = document.getElementById('categoryIcon')

        setLoading(false)
        const formData = new FormData();
        formData.append("image", file);
        formData.append("name",  AttributeName.value);
        formData.append("icon",  categoryIcon.value);
        formData.append("searchable",  searchable_status.checked ? 'Active' : 'Inactive');
        formData.append("status", status_active.checked ? 'Active' : 'Inactive');
        formData.append("parent_category", subCatSelect.value != 'Select' ? subCatSelect.value : '');

        axios.post('/categories/post',formData ).then(res =>{ 
            setLoading(false)
            setCategoryAdded(res)
            
            toast(() => (
                <div className='d-flex'>
                  <div className='me-1'>
                    <Avatar size='sm' color='success' icon={<Icons.Check size={12} />} />
                  </div>
                  <div className='d-flex flex-column'>
                    <h6 className='toast-title'>Category has been added successfuly!</h6>
                  </div>
                </div>
              ))
        }).catch(res => {
            toast(() => (
                <div className='d-flex'>
                  <div className='me-1'>
                    <Avatar size='sm' color='danger' icon={<Icons.X size={12} />} />
                  </div>
                  <div className='d-flex flex-column'>
                    <h6 className='toast-title'>Failed to add new category!</h6>
                  </div>
                </div>
              ))
        })
    }

    let handleActions = (e) => {
        let AttributeName = document.getElementById('AttributeName'),
            AttributeDescription = document.getElementById('AttributeDescription'),
            searchable_status = document.getElementById('searchable_status'),
            status_InActive = document.getElementById('status_InActive'),
            status_active = document.getElementById('status_active'),
            subCategoryCheckbox = document.getElementById('subCategoryCheckbox'),
            subCatSelect = document.getElementById('subCatSelect'),
            subCategoryLabel = document.querySelector('.subCategoryLabel'),
            saveBtn = document.querySelector('#saveBtn'),
            updateBtn = document.querySelector('#updateBtn')

        if (e.target.value == 'delete') {
            // console.log('delete action ' + e.target.id)
            let __id = e.target.id
            setLoading(false)
            axios.delete(`/categories/delete/${__id}`).then(res => {
                setLoading(false)
                setDeleted(res)

                toast(() => (
                    <div className='d-flex'>
                      <div className='me-1'>
                        <Avatar size='sm' color='success' icon={<Icons.Check size={12} />} />
                      </div>
                      <div className='d-flex flex-column'>
                        <h6 className='toast-title'>Category has been deleted successfuly!</h6>
                      </div>
                    </div>
                  ))
            }).catch('The new category')
        }

        if (e.target.value == 'edit') {
            // show buttons buttons
            saveBtn.classList.add('d-none')
            updateBtn.classList.remove('d-none')
            setSelectedEditId(e.target.id)
            setFile(null)

            AttributeName.value = e.target.getAttribute('cat_name')
            AttributeDescription.value = e.target.getAttribute('cat_name')
            e.target.getAttribute('status') == 'Active' ? status_active.checked = true : status_InActive.checked = true
            e.target.getAttribute('searchable') == 'Active' ? searchable_status.checked = true : status_InActive.checked = true

            if (e.target.getAttribute('parent_category')) {
                subCategoryCheckbox.checked = true;
                subCategoryLabel.classList.remove('d-none')
                subCategoryLabel.querySelector('select').classList.remove('d-none')

                subCatSelect.value = e.target.getAttribute('parent_category')
            } else {
                subCategoryCheckbox.checked = false;
                subCategoryLabel.classList.add('d-none')
                subCategoryLabel.querySelector('select').classList.add('d-none')

            }
        } else {
            saveBtn.classList.remove('d-none')
            updateBtn.classList.add('d-none')
        }

        if (e.target.value == 'copyId') {
            navigator.clipboard.writeText(e.target.id)
            toast(() => (
                <div className='d-flex'>
                  <div className='me-1'>
                    <Avatar size='sm' color='success' icon={<Icons.Check size={12} />} />
                  </div>
                  <div className='d-flex flex-column'>
                    <h6 className='toast-title'>Category ID has been coppied successfuly!</h6>
                  </div>
                </div>
              ))
            
            document.getElementById(e.target.id).value = 'Select'; // reset selectbox
        }

        if (e.target.value == 'show') {
            setShow(true)
            setSelectedEditId(e.target.id)

            axios.get(`/categories/view/${e.target.id}`).then(res => {
                setShowData(res.data.data)
            }).catch(error => alert(error))
        }

    }

    let handleUpdateCategory = () => {
        let AttributeName = document.getElementById('AttributeName'),
            searchable_status = document.getElementById('searchable_status'),
            status_active = document.getElementById('status_active'),
            subCatSelect = document.getElementById('subCatSelect'),
            categoryIcon = document.getElementById('categoryIcon')

            setLoading(false)
            
            const formData = new FormData();
            formData.append("name", AttributeName.value);
            formData.append("searchable", searchable_status.checked ? 'Active' : 'Inactive');
            formData.append("parent_category", subCatSelect.value != 'Select' ? subCatSelect.value : '');
            formData.append("status", status_active.checked ? 'Active' : 'Inactive');
            formData.append("icon", categoryIcon.value);
            formData.append("image", file);
            console.log(selectedEditId)
        axios.post(`/categories/update/${selectedEditId}`, formData).then(res => {
            setLoading(false)
            setCategoryUpdated(res)
            
            toast(() => (
                <div className='d-flex'>
                  <div className='me-1'>
                    <Avatar size='sm' color='success' icon={<Icons.Check size={12} />} />
                  </div>
                  <div className='d-flex flex-column'>
                    <h6 className='toast-title'>Category has been updated successfuly!</h6>
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
                    <h6 className='toast-title'>Failed to update category!</h6>
                  </div>
                </div>
              ))
        })
    }

    let handleIcon = () => {
        let iconMenu = document.getElementById('iconMenu')
            // iconTableShadow = document.getElementById('iconTableShadow')

        iconMenu.classList.remove('d-none')
        // iconTableShadow.classList.remove('d-none')   
    }
    return (
        <Fragment>
            {/* <div onClick={handleCloseIcon} id='iconTableShadow' className='iconTableShadow d-none'></div> */}
            <Row>
                <Col md={4} xs={12}>
                    <Card>
                        <CardBody>
                            <div className='text-center mb-2'>
                                <h5 className='mb-1'>Add Category</h5>
                            </div>
                            <Form onSubmit={(e) => e.preventDefault()}>
                                <Row className='gy-1 pt-75'>
                                    <Col md={12} xs={12}>
                                        <Label className='form-label' for='AttributeName'>
                                            Name <span className='text-danger'>*</span>
                                        </Label>
                                        <Input
                                            type='text'
                                            id='AttributeName'
                                            placeholder='Name'
                                            required
                                            onChange={handleChangeName}
                                        />
                                    </Col>
                                    <Col md={12} xs={12}>
                                        <Label className='form-label' for='AttributeDescription'>
                                            Description <span className='text-danger'>*</span>
                                        </Label>
                                        <Input
                                            type='text'
                                            id='AttributeDescription'
                                            placeholder='Description'
                                            required
                                        />
                                    </Col>

                                    <Col md={12} xs={12}>
                                        <Label className='form-label' for='AttributeStatus'>
                                            Status <span className='text-danger'>*</span>
                                        </Label>
                                        <FormGroup>
                                            <Label style={{ 'display': 'block' }}>
                                                <Input type="radio" id='status_active' class="form-check-input" name="status" checked /> Active
                                            </Label>
                                            <Label style={{ 'display': 'block' }}>
                                                <Input type="radio" id='status_InActive' class="form-check-input" name="status" /> Inactive
                                            </Label>
                                        </FormGroup>

                                    </Col>
                                    
                                    {/* Add attribute filed */}
                                    <Col md={12} xs={12}>
                                        <Label className='form-label' for='AttributeStatus'>
                                            Attribute value <span className='text-danger'>*</span>
                                        </Label>
                                        <div>
                                            <Input
                                                type='text'
                                                id='Attributevalue'
                                                placeholder='Attribute value'
                                                required
                                            />
                                            <div onClick={
                                                (e) => {
                                                    if(e.target.classList.contains('attributeMinusMinus')){
                                                        e.target.parentNode.remove()
                                                    }
                                                }
                                            } id='attributePlusPlus'></div>
                                            <p className='btn btn-primary attributePlusPlusBtn' onClick={() => {
                                                let attributePlusPlus = document.getElementById('attributePlusPlus')
                                                attributePlusPlus.innerHTML += `
                                                    <p class="attributeMinusMinusP">
                                                        <input class="form-control attributeMinusMinusInput" type='text' id="APP_seplings_${Number(attributePlusPlus.childElementCount) + 1}" placeholder="Attribute value" required />
                                                        <span class="attributeMinusMinus" id="APP_seplings_${Number(attributePlusPlus.childElementCount) + 1}">-</span>
                                                    </p>
                                                `
                                            }}>+ Add Value</p>
                                        </div>

                                    </Col>

                                    <div className='d-flex justify-content-center pt-2'>
                                        <Button type='submit' color='primary' id='saveBtn' onClick={handleAddCategory}>Save</Button>
                                    </div>
                                    <div className='d-flex justify-content-center pt-2'>
                                        <Button type='submit' color='primary' className='d-none' id='updateBtn' onClick={handleUpdateCategory}>Update</Button>
                                    </div>
                                </Row>
                            </Form>

                        </CardBody>
                    </Card>
                </Col>
                <Col md={8} xs={12}>
                    <Card>
                        <CardBody>
                            <Row>
                                <input type='search' class="form-control" placeholder='Search' onChange={handleSearch} />
                            </Row>
                            <Row>
                                <Col md={12} xs={12}>
                                    {
                                        loading == false ? <SpinnerLoading /> :
                                        allCategoriesData == '' ? <p style={{ 'width': '100%', 'text-align': 'center', 'padding': '20px 5px' }}>No data to show</p> :
                                            <div className=' table-responsive'>
                                                <Table className='table table-striped'>
                                                <thead>
                                                    <tr>
                                                        <td>SL</td>
                                                        <td>Attribute Name</td>
                                                        <td>Description</td>
                                                        <td>Status</td>
                                                        <td>Actions</td>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        allCategoriesData.map(res =>
                                                            <tr key={res.id}>
                                                                <td>{res.id}</td>
                                                                <td>{res.name}</td>
                                                                <td>{res.parent_category?.name == null ? 'Parent' : res.parent_category?.name}</td>
                                                                <td>{res.status}</td>
                                                                <td>
                                                                    <select onChange={handleActions} id={res.id} cat_name={res.name} parent_category={res.parent_category?.name} status={res.status} searchable={res.searchable} className='form-select'>
                                                                        <option selected>Select</option>
                                                                        <option value='show'>Show</option>
                                                                        <option value='copyId'>Copy ID</option>
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
                                    }
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Modal isOpen={show} toggle={() => { setShow(!show); document.getElementById(selectedEditId).value = 'Select' }} className='modal-dialog-centered modal-lg'>
                <ModalHeader className='bg-transparent' toggle={() => { setShow(!show); document.getElementById(selectedEditId).value = 'Select' }}></ModalHeader>
                <ModalBody className='px-sm-5 pt-50 pb-5'>
                    {
                        showData == '' ? <SpinnerLoading /> :
                            <div className='text-center mb-2'>
                                <h1 className='mb-1'>Show Attribute</h1>
                                <p style={{ 'text-align': 'left' }}><span><b>Name: </b></span><span>{showData.name}</span></p>
                                <p style={{ 'text-align': 'left' }}><span><b>Slug: </b></span><span>{showData.name}</span></p>
                                <p style={{ 'text-align': 'left' }}><span><b>Searchable: </b></span><span>{showData.searchable}</span></p>
                                <p style={{ 'text-align': 'left' }}><span><b>Parent Category: </b></span><span>{showData.parent_category == null ? 'Parent' : showData.parent_category}</span></p>
                                <p style={{ 'text-align': 'left' }}><span><b>Icon: </b></span><span>{showData.icon == null ? 'No Icons' : showData.icon}</span></p>
                                <p style={{ 'text-align': 'left' }}><span><b>Status: </b></span><span>{showData.status}</span></p>
                            </div>
                    }
                </ModalBody>
            </Modal>
        </Fragment>
    )
}
