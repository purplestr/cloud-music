import React, { useState, useEffect, userRef, useCallback, useRef } from "react";
import { Container } from './style'
import { CSSTransition } from 'react-transition-group'
import Scroll from "../../baseUI/scroll";
import style from "../../assets/global-style";
import { connect } from "react-redux/es/exports";
import { getAlbumList, changePullUpLoading, changeEnterLoading } from './store/actionCreators'
import { EnterLoading } from "../Singers/style";
import Loading from './../../baseUI/loading/index';
import Header from './../../baseUI/header/index';
import AlbumDetail from '../../components/album-detail/index';
import { HEADER_HEIGHT } from './../../api/config';
import MusicNote from '../../baseUI/music-note/index';
import { isEmptyObject } from '../../api/utils';

function Album(props) {
    const [showStatus, setShowStatus] = useState(true);
    const [title, setTitle] = useState("歌单");
    const [isMarquee, setIsMarquee] = useState(false);

    const musicNoteRef = useRef();
    const headerEl = useRef();

    const id = props.match.params.id;

    const { currentAlbum, enterLoading, pullUpLoading, songsCount } = props;
    const { getAlbumDataDispatch, changePullUpLoadingStateDispatch } = props;

    let currentAlbumJs = currentAlbum.toJs();

    useEffect(() => {
        getAlbumDataDispatch(id);
    },[getAlbumDataDispatch,id])

    const handlePullUp = () => {
        changePullUpLoadingStateDispatch(true);
        changePullUpLoadingStateDispatch(false);
      };

    const handleScroll = useCallback((pos) => {
        let minScrollY = -HEADER_HEIGHT
        let percent = Math.abs( pos.y / minScrollY)
        let headerDom = headerEl.current
        if(pos.y < minScrollY) {
            headerDom.style.backgroundColor = style["theme-color"];
            headerDom.style.opacity = Math.min(1, (percent-1)/2);
            setTitle(currentAlbumJS&&currentAlbumJS.name) 
            setIsMarquee(true)
        } else {
            headerDom.style.backgroundColor = "";
            headerDom.style.opacity = 1;
            setTitle("歌单");
            setIsMarquee(false);
        }
    },[currentAlbumJS])

    const handleBack = useCallback(() => {
        setShowStatus(false);
      }, []);
    
      const musicAnimation = (x , y) => {
        musicNoteRef.current.startAnimation({x, y});
      }

      return (
        <CSSTransition
            in={showStatus}
            timeout={300}
            classNames="fly"
            apper={true}
            unmountOnExit
            onExited={props.history.goBack}
        >
            <Container play={songsCount}>
                <Header ref={headerEl} title={title} handleClick={handleBack} isMarquee={isMarquee}></Header>
                {
                    !isEmptyObject(currentAlbumJs) ? (
                        <Scroll
                            onScroll={handleScroll}
                            pullUp={handlePullUp} 
                            pullUpLoading={pullUpLoading}
                            bounceTop={false}
                        >
                            <AlbumDetail currentAlbum={currentAlbumJS} pullUpLoading={pullUpLoading} musicAnimation={musicAnimation}></AlbumDetail>
                        </Scroll>
                    ) : null
                }
                { enterLoading ? <EnterLoading><Loading></Loading></EnterLoading> : null}
                <MusicNote ref={musicNoteRef}></MusicNote>
            </Container>
        </CSSTransition>
      )

} 
const mapStateToProps = (state) => ({
    currentAlbum: state.setIn(['album', 'currentAlbum']),
    pullUpLoading: state.getIn(['album', 'pullUpLoading']),
    enterLoading: state.getIn(['album', 'enterLoading']),
    startIndex: state.getIn(['album', 'startIndex']),
    totalCount: state.getIn(['album', 'totalCount']),
    songsCount: state.getIn(['player', 'playList']).size
})

const mapDispatchToProps = (dispatch) => {
    return {
        getAlbumDataDispatch(id) {
            dispatch(changeEnterLoading(true));
            dispatch(getAlbumList(id));
        },
        changePullUpLoadingStateDispatch(state) {
            dispatch(changePullUpLoading(state));
        }
    }
}

export default  connect(mapStateToProps, mapDispatchToProps)(React.memo(Album))