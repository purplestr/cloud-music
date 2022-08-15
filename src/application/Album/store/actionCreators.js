import { CHANGE_CURRENT_ALBUM, CHANGE_TOTAL_COUNT, CHANGE_PULLUP_LOADING, CHANGE_START_INDEX, CHANGE_ENTER_LOADING } from './constants';
import { getAlbumDetailRequest } from '../../../api/request';
import { fromJS } from 'immutable';

const changeCurrentAlbum = (data) => ({
    type: CHANGE_CURRENT_ALBUM,
    data
})

export const changeTotalCount = (data) => ({
    type: CHANGE_TOTAL_COUNT,
    data
})

export const chengePullLoading = (data) => ({
    type: CHANGE_PULLUP_LOADING,
    data
})

export const changeEnterLoading = (data) => ({
    type: CHANGE_ENTER_LOADING,
    data
  });

export const changeStartIndex = (data) => ({
    type: CHANGE_START_INDEX,
    data
})

export const getAlbumList = (id) => {
   return dispath => {
    getAlbumDetailRequest(id).then(res => {
        let data = res.playlist
        dispath(changeCurrentAlbum(data))
        dispath(changeEnterLoading(false))
        dispath(changeStartIndex(0))
        dispath(changeTotalCount(data.tracks.length))
    }).catch(err => {
        console.log("获取album数据失败!")
    })
   }
}