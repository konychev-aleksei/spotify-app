import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'

import SwiperCore, { Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper.scss'
import 'swiper/components/pagination/pagination.scss'

import AppContext from '../../AppContext'


const SwipingList = ({ content, playlist }) => {
  const history = useHistory()
  const { userName } = useContext(AppContext)

  return(
    <Swiper
      breakpoints={{
        550: {
          slidesPerView: 2
        },
        800: {
          slidesPerView: 3
        },
        1050: {
          slidesPerView: 4
        },
        1300: {
          slidesPerView: 5
        },
        1400: {
          slidesPerView: 6
        },
        1600: {
          slidesPerView: 7
        }
      }}
      spaceBetween={ 220 }
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
    >
      {
        [...content, 0].map((item, index) => {
          let { owner, thumb, _id } = item

          if (!playlist) {
            _id = item
            owner = null
            thumb = `/artists/${_id}.jpg`
          }
          else {
            owner = `Author: ${ owner === userName ? 'You' : owner }`
          }


          return (
            <SwiperSlide key={ index }>
              {
                item === 0 ?
                <div />
                :
                <div
                  onClick={ () => history.push(`/${playlist ? 'playlist' : 'artist'}/${_id}`) }
                  className="swiper-item"
                >
                  <img
                    style={{ borderRadius: playlist ? null : '50%' }}
                    src={ thumb }
                    alt=""
                  />
                  <h1>{ _id }</h1>
                  <p>{ owner }</p>
                </div>
              }
            </SwiperSlide>
          )
        })
      }
    </Swiper>
  )
}

export default SwipingList
