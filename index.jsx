/*
 * @Author: 孟闲闲 video 组件
 * @Date: 2018-09-06 10:57:13
 * @Last Modified by: mxx
 * @Last Modified time: 2018-09-06 17:36:13
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.scss'

const playIcon = require('./STOP.png')
const stopIcon = require('./PLAY.png')

export class Video extends Component {
  // isPlay - 正在播放
  // time - 视频总时长
  // move - 当前已播放进度
  // width - 当前已播放展示宽度
  state = { hasError: null, isPlay: null, time: 0, move: 0, width: 0 }

  componentDidMount () {
    const { endCb, pauseCb } = this.props
    const target = this.video
    
    // 获取视频总时长
    target.onloadedmetadata = () => {
      this.setState({ time: target.duration })
    }

    target.onplay = () => {
      this.setState({ isPlay: true })
    }
    target.onended = () => {
      endCb && endCb()
    }
    target.onpause = () => {
      pauseCb && pauseCb()
    }
    target.ontimeupdate = () => {
      const { currentTime, duration } = target
      this.setState({ move: currentTime, width: currentTime / duration })
    }
  }

  componentDidCatch() {
    this.setState({ hasError: true })
  }

  // 根据当前视频的状态处理 是要播放视频还是暂停 
  control () {
    const target = this.video
    const status = target.paused
    if (status) {
      target.play()
      this.setState({ isPlay: true })
    } else {
      target.pause()
      this.setState({ isPlay: false })
    }
  }

  render () {
    const { src, poster = '', type = 'video/mp4' } = this.props
    // 没有传递src 返回空
    if (!src) return ''
    let { hasError, isPlay, time, move, width } = this.state
    width = `${width * 100}%`
    move = move.toFixed(2)
    time = time.toFixed(2)
    if (hasError) {
      return <h1>组件出错了</h1>
    }
    return (
      <div className='videoBox'>
        <video
          poster={poster}
          ref={node => this.video = node}
          x-webkit-airplay='allow'
          x5-video-player-type='h5'
          x5-video-player-fullscreen='true'
          x5-playsinline='true'
          webkit-playsinline='true'
          playsInline='true'
        >
          设备不支持
          <source src={src} type={type} />
        </video>
        <div className='controllers'>
          <img role='presentation' onClick={() => this.control()} src={isPlay ? playIcon : stopIcon} alt='icon'/>
          <span>{move}</span>
          <b><i style={{ width }} /></b>
          <span>{time}</span>
        </div>
      </div>
    )
  }
}

Video.propTypes = {
  // 视频地址
  src: PropTypes.string.isRequired,
  // 视频类型
  type: PropTypes.string,
  // 封面
  poster: PropTypes.string,
  // 暂停的回调
  pauseCb: PropTypes.func,
  // 结束的回调
  endCb: PropTypes.func,
}

// 播放视频
export const videoPlay = () => {
  const video = document.querySelector('video')
  video && video.play()
}
// 暂停视频
export const videoPause = () => {
  const video = document.querySelector('video')
  video && video.pause()
}
