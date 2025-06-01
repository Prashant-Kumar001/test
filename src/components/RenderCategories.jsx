import React from 'react'
import { Link } from 'react-router-dom'

const RenderCategories = ({ query }) => {
    return (
        <>
            <Link className='text-gray-600 hover:text-gray-800 '  to={{
                pathname: "search",
                search: `?category=${query}`
            }}>{query}</Link>
        </>
    )
}

export default RenderCategories