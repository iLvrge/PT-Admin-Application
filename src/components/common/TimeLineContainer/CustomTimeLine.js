import React, {useEffect} from 'react';
import TimeLine from 'react-visjs-timeline';

function CustomTimeLine(props) {

  let groups, items, options;

  useEffect(() => {
    groups.push(props.groups1);
    groups.push(props.groups3);

  }, []);

  return (
    <TimeLine

    />
  )
}

export default CustomTimeLine;