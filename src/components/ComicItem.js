/**
 * Created by Tongming on 2016/12/26.
 */
import React, {Component, PropTypes} from 'react';
require('../css/ComicItem.css');

class ComicItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const {cover, comic_author, comic_name, newest_chapter} = this.props.comic;
		return (
			<div className="comic-i">
				<img className="cover"
				     src={cover === '' ? require('../images/load_error.png') : cover}
				     alt={comic_name}/>
				<strong ref={comic_name} className="title-i">{comic_name}</strong>
				<span className="author-i">
					{comic_author.trim() === "" ? (newest_chapter.trim() === '' ? '未知' : newest_chapter) : comic_author}
				</span>
			</div>
		)
	}
}

Component.PropTypes = {
	comic: PropTypes.object.isRequired,
};

export default ComicItem;