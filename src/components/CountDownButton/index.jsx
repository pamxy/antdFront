import React, { useState } from 'react';
import { Button } from 'antd';
import { useInterval, useBoolean } from 'react-use';
import { usePersistFn, useCounter } from '@umijs/hooks'

/* 是否开始倒计时
 start?: boolean;
// 倒计时时长（秒）默认60
 second?: number;
// 初始化按钮显示文本
 initText?: string;
// 运行时显示文本
// 自己设置必须包含{%s}
 runText?: string;
// 运行结束后显示文本
 resetText?: string;
// 倒计时结束执行函数
 onEnd?: () => void;
 */

const getTemplateText = (runText, second) => runText.replace(/\{([^{]*?)%s(.*?)\}/g, second.toString())

const CountDownButton = ({ start, second, initText, resetText, runText, onEnd, ...rest }) => {
  // const { loading, countStatus } = ;
  const [count, {
    dec,
    reset
  }] = useCounter(second, { min: 0, max: second });

  const [delay] = useState(1000);
  const [loading, toggleLoading] = useBoolean(start);
  const [done, toggleDone] = useBoolean(false);

  const timeout = usePersistFn(() => {
    // 设置为运行结束后状态
    // 发出倒计时结束事件
    onEnd && onEnd();
  });


  useInterval(
    () => {
      dec();
      if (count === 0) {
        toggleLoading;
        reset();
        timeout();
        toggleDone(true);
      }
    },
    loading ? delay : null
  );


  const buttonText = () => {
    console.log(done, start, count, second)
    if (done) return resetText;
    if (!start && !done) return initText;
    if (start && count <= second) return getTemplateText(runText, count);
  };

  return (
    <Button loading={start} {...rest}>
      {buttonText()}
    </Button>
  );
};


export default CountDownButton;
