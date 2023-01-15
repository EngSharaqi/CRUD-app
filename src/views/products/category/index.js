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
import ReactPaginate from 'react-paginate'

export default function Category () {
    // get text from Name and pass it to Slug
    const [allCategoriesData, setAllCategoriesData] = useState([])
    const [selectedEditId, setSelectedEditId] = useState('')
    const [show, setShow] = useState(false)
    const [showData, setShowData] = useState([])
    const [allCategoriesDataAlt, setAllCategoriesDataAlt] = useState([])
    const [file, setFile] = useState(null)
    const [iconName, setIconName] = useState('')
    const [deleted, setDeleted] = useState(null)
    const [categoryAdded, setCategoryAdded] = useState(null)
    const [categoryUpdated, setCategoryUpdated] = useState(null)
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    let handleChangeName = (e) => {
        document.getElementById('categorySlug').value = e.target.value
    }

    let handleSearch = (e) => {
        if (e.target.value != '') {
            axios.get(`/categories/search?search=${e.target.value}`).then(res => {
                if (e.target.value != '') {
                    setAllCategoriesData(res.data.data)
                } else {
                    setAllCategoriesData(allCategoriesDataAlt)
                }
            })
        }
    }

    useEffect(() => {
        axios.get(`/categories/get?page=${currentPage}`)
        .then(res => {
            setLoading(true)
            setAllCategoriesData(res.data.data)
            setAllCategoriesDataAlt(res.data.data)
        })
        .catch(error => {
            window.localStorage.clear()
            window.location.href = '/login'
        })
    }, [deleted, categoryAdded, categoryUpdated, currentPage])

    // icons settings
    const IconsArr = []
  
    // ** States
    const [query, setQuery] = useState([]),
      [filteredArr, setFilteredArr] = useState([]),
      [active, setActive] = useState(null)
  
    for (const key in Icons) {
      IconsArr.push(key)
    }
  
    const handleFilter = val => {
      const arr = []
      if (val.length) {
        IconsArr.filter(icon => {
          if (icon.toLowerCase().includes(val.toLowerCase())) {
            arr.push(icon)
          }
        })
      }
      setFilteredArr([...arr])
    }
  
    const handleIconCardClick = icon => {
      setActive(icon)
      setIconName(icon)

      toast(() => (
        <div className='d-flex'>
          <div className='me-1'>
            <Avatar size='sm' color='success' icon={<Icons.Check size={12} />} />
          </div>
          <div className='d-flex flex-column'>
            <h6 className='toast-title'>Icon Name Copied! 📋</h6>
            <span role='img' aria-label='toast-text'>
              {icon}
            </span>
          </div>
        </div>
      ))
       
    }
  
    const renderIcons = () => {
      const dataToRender = query.length ? filteredArr : IconsArr
      if (dataToRender.length) {
        return dataToRender.map(icon => {
          const IconTag = Icons[icon]
          return (
            <Fragment key={icon}>
              <CopyToClipboard text={`<${icon} />`}>
                <Card
                  id={icon}
                  className={classnames('icon-card cursor-pointer text-center mb-2 mx-50', {
                    active: active === icon
                  })}
                  onClick={() => handleIconCardClick(icon)}
                >
                  <CardBody>
                    <div className='icon-wrapper'>
                      <IconTag />
                    </div>
                    <p className='icon-name text-truncate mb-0 mt-1'>{icon}</p>
                  </CardBody>
                </Card>
              </CopyToClipboard>
              <UncontrolledTooltip placement='top' target={icon}>
                {icon}
              </UncontrolledTooltip>
            </Fragment>
          )
        })
      } else {
        return (
          <div className='d-flex align-items-center justify-content-center w-100'>
            <h4 className='mb-0'>No Icons Found!</h4>
          </div>
        )
      }
    }
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
        let categoryName = document.getElementById('categoryName'),
            searchable_active = document.getElementById('searchable_active'),
            status_active = document.getElementById('status_active'),
            subCatSelect = document.getElementById('subCatSelect'),
            categoryIcon = document.getElementById('categoryIcon')

        setLoading(false)
        const formData = new FormData();
        formData.append("image", file);
        formData.append("name",  categoryName.value);
        formData.append("icon",  categoryIcon.value);
        formData.append("searchable",  searchable_active.checked ? 'Active' : 'Inactive');
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
        let categoryName = document.getElementById('categoryName'),
            categorySlug = document.getElementById('categorySlug'),
            searchable_active = document.getElementById('searchable_active'),
            searchable_InActive = document.getElementById('searchable_InActive'),
            status_active = document.getElementById('status_active'),
            status_InActive = document.getElementById('status_InActive'),
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

            categoryName.value = e.target.getAttribute('cat_name')
            categorySlug.value = e.target.getAttribute('cat_name')
            e.target.getAttribute('status') == 'Active' ? status_active.checked = true : status_InActive.checked = true
            e.target.getAttribute('searchable') == 'Active' ? searchable_active.checked = true : searchable_InActive.checked = true

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
        let categoryName = document.getElementById('categoryName'),
            searchable_active = document.getElementById('searchable_active'),
            status_active = document.getElementById('status_active'),
            subCatSelect = document.getElementById('subCatSelect'),
            categoryIcon = document.getElementById('categoryIcon')

            setLoading(false)
            
            const formData = new FormData();
            formData.append("name", categoryName.value);
            formData.append("searchable", searchable_active.checked ? 'Active' : 'Inactive');
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

    const handlePagination = page => {
        ({
            page: page.selected + 1
        })
        setCurrentPage(page.selected + 1)
        setLoading(false)
}

const count = Math.ceil(Number((Number(allCategoriesData?.total) / Number(allCategoriesData?.per_page))))

    return (
        <Fragment>
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
                                        <Label className='form-label' for='categoryName'>
                                            Name <span className='text-danger'>*</span>
                                        </Label>
                                        <Input
                                            type='text'
                                            id='categoryName'
                                            placeholder='Name'
                                            required
                                            onChange={handleChangeName}
                                        />
                                    </Col>
                                    <Col md={12} xs={12}>
                                        <Label className='form-label' for='categorySlug'>
                                            Slug <span className='text-danger'>*</span>
                                        </Label>
                                        <Input
                                            type='text'
                                            id='categorySlug'
                                            placeholder='Slug'
                                            required
                                        />
                                    </Col>
                                    <Col style={{'position': 'relative'}} md={12} xs={12}>
                                        <Label className='form-label' for='categoryIcon'>
                                            Icon
                                        </Label>
                                        <Input
                                            type='text'
                                            id='categoryIcon'
                                            placeholder='Icon'
                                            defaultValue={iconName}
                                            onClick={handleIcon}
                                        />

                                        {/* icons */}
                                        <div id='iconMenu' className='chooseIcon d-none'>
                                            <div>
                                            <Row>
                                                <Col sm='12'>
                                                    <div style={{'padding': '0 15px', 'display': 'flex', 'alignItems': 'center'}} className='icon-search-wrapper my-3 mx-auto'>
                                                        <InputGroup className='input-group-merge mb-1'>
                                                            <InputGroupText>
                                                                <Icons.Search size={14} />
                                                            </InputGroupText>
                                                            <Input
                                                                placeholder='Search icons...'
                                                                onChange={e => {
                                                                    handleFilter(e.target.value)
                                                                    setQuery(e.target.value)
                                                                }}
                                                            />
                                                        </InputGroup>
                                                        <Icons.X onClick={() => {
                                                            let iconMenu = document.getElementById('iconMenu')
                                                            iconMenu.classList.add('d-none')
                                                        }} size={30} style={{'marginBottom': '1rem', 'cursor': 'pointer', 'marginLeft': '7px'}}/>
                                                    </div>
                                                </Col>
                                            </Row>
                                            </div>
                                            <div className='d-flex flex-wrap' id='icons-container'>
                                                {renderIcons()}
                                            </div>
                                        </div>
                                    </Col>

                                    <Col md={12} xs={12}>
                                        <Label className='form-label' for='categorySlug'>
                                            Searchable
                                        </Label>

                                        <FormGroup>
                                            <Label style={{ 'display': 'block' }}>
                                                <Input type="radio" id='searchable_active' class="form-check-input" name="searchable"  checked /> Active
                                            </Label>
                                            <Label style={{ 'display': 'block' }}>
                                                <Input type="radio" id='searchable_InActive' class="form-check-input" name="searchable" /> Inactive
                                            </Label>
                                        </FormGroup>

                                        <Label className='form-label' for='categorySlug'>
                                            Status
                                        </Label>
                                        <FormGroup>
                                            <Label style={{ 'display': 'block' }}>
                                                <Input type="radio" id='status_active' class="form-check-input" name="status" checked /> Active
                                            </Label>
                                            <Label style={{ 'display': 'block' }}>
                                                <Input type="radio" id='status_InActive' class="form-check-input" name="status" /> Inactive
                                            </Label>
                                        </FormGroup>

                                        <FormGroup>
                                            <Label style={{ 'display': 'block' }}>
                                                <Input type="checkbox" id='subCategoryCheckbox' class="form-check-input" name="status" onClick={isAddSubChecked} /> Add as Sub-Category
                                            </Label>
                                            <Label className='subCategoryLabel d-none'> Parent Category <span className='text-danger'>*</span>
                                                <select required id='subCatSelect' className='form-select d-none'>
                                                    <option selected>Select</option>
                                                    {
                                                        allCategoriesData.data?.map(res => <option key={res.id} value={res.id}>{res.name}</option>)
                                                    }
                                                </select>
                                            </Label>
                                        </FormGroup>

                                        <Col md={12} xs={12}>
                                            <Label className='form-label' for='categorySlug'>
                                                Upload photo
                                            </Label>
                                            <Input
                                                type='file'
                                                id='categoryImg'
                                                placeholder='Choose an image'
                                                onChange={(e) => {
                                                    setFile(e.target.files[0])
                                                }}
                                            />
                                        </Col>
                                        <Col md={12} xs={12}>
                                            <div id='test11'>

                                            </div>
                                            <img  id='test1111' width='200' />
                                        </Col>

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
                                                        <td>ID</td>
                                                        <td>Name</td>
                                                        <td>Parent Category</td>
                                                        <td>States</td>
                                                        <td>Actions</td>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        allCategoriesData.data.map(res =>
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
                            <Row>
                                {
                                    count == 1 ? '' :
                                    <ReactPaginate
                                    nextLabel=''
                                    breakLabel='...'
                                    previousLabel=''
                                    pageCount={count || 1}
                                    activeClassName='active'
                                    breakClassName='page-item'
                                    pageClassName={`page-item ${count}`}
                                    breakLinkClassName='page-link'
                                    nextLinkClassName={'page-link'}
                                    pageLinkClassName={'page-link'}
                                    nextClassName={'page-item next'}
                                    previousLinkClassName={'page-link'}
                                    previousClassName={'page-item prev'}
                                    onPageChange={page => handlePagination(page)}
                                    containerClassName={'pagination react-paginate justify-content-end p-1'}
                                />
                                }
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
                                <h1 className='mb-1'>Show Category</h1>
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
