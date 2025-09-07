import { Tooltip } from "@mui/material";
import { formatTime, getRelativeTime } from "../tools/date";

interface Props {
  dateTime: Date;
}

export const RelativeTime = (
  props: Props,
): React.JSX.Element => {
  const { dateTime } = props;

  return (
    <Tooltip title={formatTime(dateTime, 'long')} placement={'bottom'}>
      <div>{getRelativeTime(dateTime)}</div>
    </Tooltip>
  );
};
