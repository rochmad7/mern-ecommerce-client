import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';

const Search = () => {
    const dispatch = useDispatch();
    const { search } = useSelector((state) => ({ ...state }));
    const { text } = search;

    const history = useHistory();

    const handleChange = (e) => {
        dispatch({
            type: 'SEARCH_QUERY',
            payload: { text: e.target.value },
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        history.push(`/shop?${text}`);
    };

    return (
        <form className="my-2 my-lg-0 p-1" onSubmit={handleSubmit}>
            <div className="row align-items-center">
                <div className="col-md-8">
                    <input
                        onChange={handleChange}
                        type="search"
                        value={text}
                        className="form-control mr-sm-2"
                        placeholder="Search"
                    />
                </div>
                <div className="col">
                    <SearchOutlined
                        onClick={handleSubmit}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
            </div>
        </form>
    );
};

export default Search;
