/**
 * Created by Tongming on 2017/1/4.
 */
import React, {PropTypes} from 'react'
import BaseView from './BaseView'
import ComicGrid from '../components/ComicGrid'
import Toolbar from '../components/Toolbar'
import Loading from '../components/Loading'
import {readUTF, getDocumentTop, getWindowHeight, getScrollHeight, getScreenWidth} from '../utils'
import {SEARCH} from '../constants/Const'
import {connect} from 'react-redux'
import {fetchDataIfNeed, recordLocation} from '../actions'
require('../css/Category.css');

class Search extends BaseView {
	constructor(props) {
		super(props);
		this.path = '';
		this.query = {};
		this.title = '';
		this.type = 0;
		this.isInit = false;
		this.startCover = 0;
	}

	componentDidMount() {
		window.onscroll = () => {
			if (this.props.status === 1 && getScrollHeight() <= getWindowHeight() + Math.round(getDocumentTop()) + 1) {
				this.loadMore();
			}
		};
		this.getQuery();
		this.getData();
		if (this.props.status === 1) {
			document.body.scrollTop = this.props.localTop;
		}
		this.initCover();
	}

	componentWillUnmount() {
		super.componentWillUnmount();
		this.props.dispatch(recordLocation(getDocumentTop(), SEARCH));
		window.onscroll = null;
	}

	getQuery() {
		let location = this.props.location;
		if (location.query === undefined) {
			//404
		}
		if (location.query.word === undefined) {
			this.title = readUTF(new RegExp('/category/(.*)/').exec(window.location.pathname)[1]);
			this.type = new RegExp('/(\\d+)').exec(window.location.pathname)[0].replace('/', '');
			this.query = {
				type: this.type,
				page: location.query.page === undefined ?
					this.props.page : location.query.page,
			};
			this.path = '/cc/comic/category';
		} else {
			this.title = '搜索：' + this.props.location.query.word;
			this.path = '/cc/search';
			this.query = {
				word: this.title,
				page: location.query.page === undefined ?
					this.props.page : location.query.page,
			}
		}
	}

	getData() {
		this.props.dispatch(fetchDataIfNeed({
			title: this.title,
			query: this.query,
			path: this.path,
			method: 'GET',
			category: SEARCH,
		}));
	}

	loadMore() {
		if (!this.props.next) {
			alert('下面没有咯。');
			return;
		}
		if (this.props.status === 0) {
			return;
		}
		this.isInit = false;
		this.query.page = this.props.page + 1;
		this.getData();
	}

	componentDidUpdate() {
		this.initCover();
	}

	initCover() {
		if (this.isInit && this.props.status !== 1) {
			return;
		}
		console.log('initCover');
		let covers = document.getElementsByClassName('cover');
		if (covers.length > this.startCover) {
			let width = getScreenWidth();
			let length = covers.length;
			let scale = 0.28;
			for (let i = this.startCover; i < length; i++) {
				covers[i].style.width = (width * scale) + 'px';
				covers[i].style.height = (width * scale * 1.4) + 'px';
			}
			this.startCover = covers.length;
			this.isInit = true;
		}
	}

	render() {
		const {status, items, title} = this.props;
		return (
			<div>
				<Toolbar title={title}/>
				<div style={{paddingTop: '4rem'}}></div>
				<ComicGrid comics={items}/>
				<Loading status={status}/>
			</div>
		)
	}
}

Search.PropTypes = {
	items: PropTypes.array.isRequired,
	title: PropTypes.string.isRequired,
	page: PropTypes.number,
	status: PropTypes.number,
	next: PropTypes.bool.isRequired,
	localTop: PropTypes.number,
};

function mapStateToProps(state) {
	return {
		items: state.searchReducer.items,
		title: state.searchReducer.title,
		page: state.searchReducer.page,
		status: state.searchReducer.status,
		next: state.searchReducer.next,
		localTop: state.searchReducer.localTop,
	}
}

export default connect(mapStateToProps)(Search)