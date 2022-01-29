import React, { forwardRef, useEffect, useState, FC } from "react";


interface TextProps {
  data: any
}

export const Text: FC<TextProps> = (textprops: TextProps) => {

  return (
    <>
      <div className='text_title'>
        <a >运输方式</a>
        <a >客运量</a>
        <a >货运量</a>
      </div>
      <div className='text_box'>
        <img className='text_bkjk' />
        <img className='text_bkjk' />
        <img className='text_bkjk' />
        <img className='text_bkjk' />
        {/* <div>小羊是个小笨蛋</div> */}
      </div>
      <div className='text_box'>
        <img className='text_bkjk' />
        <img className='text_bkjk' />
        <img className='text_bkjk' />
        <img className='text_bkjk' />
        {/* <div>小羊是个小笨蛋</div> */}
      </div>
      <div className='text_box'>
        <img className='text_bkjk' />
        <img className='text_bkjk' />
        <img className='text_bkjk' />
        <img className='text_bkjk' />
        {/* <div>小羊是个小笨蛋</div> */}
      </div>
    </>
  )

}
