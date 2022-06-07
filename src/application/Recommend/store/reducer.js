import * as actionTypes from './constants'
import { fromJS } from 'immutable'

const defauleState = fromJS({
    bannerList: [],
    recommendList: [],
    enterLoading: true
})

export default (state = defauleState,action) => {
    switch(action.type) {
        case actionTypes.CHANGE_BANNER: 
          return state.set('bannerList',action.data);
        case actionTypes.CHANGE_RECOMMEND_LIST: 
          return state.set('recommendList',action.data);
        case actionTypes.CHANGE_ENTER_LOADING: 
          return state.set('enterLoading',action.data);
        default: 
          return state
    }
}