import { Spinner } from 'reactstrap'

export default function SpinnerLoading () {
    return (
        <div
            style={{
                'width': '100%',
                'height': '100%',
                'display': 'flex',
                'alignItems': 'center',
                'justifyContent': 'center',
                'margin': '20px auto'
            }}
        >
            <Spinner
            className='me-25'
            style={{
                height: '4rem',
                width: '4rem'
            }}
            color="primary"
            />
        </div>
    )
}