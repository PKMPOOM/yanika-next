import { useBookingModalStore } from "@/store/BookingModalStore";
import { CloseOutlined } from "@ant-design/icons";
import { Radio } from "antd";
import dayjs from "dayjs";
import { useShallow } from "zustand/react/shallow";
type Props = {
  TIMEGRIDHEIGHT: number;
};

const SelectDateTimeCard = ({ TIMEGRIDHEIGHT }: Props) => {
  const [
    currentDay,
    selectedDay,
    startTime,
    classDuration,
    setStartTime,
    setClassDuration,
  ] = useBookingModalStore(
    useShallow((state) => [
      state.currentDay,
      state.selectedDay,
      state.startTime,
      state.classDuration,
      state.setStartTime,
      state.setClassDuration,
    ]),
  );

  const showSelectBar = currentDay === selectedDay && startTime !== undefined;

  const customHeight = `${TIMEGRIDHEIGHT * 2 * classDuration}px`;

  if (showSelectBar) {
    return (
      <div
        style={{
          position: "absolute",
          width: `100%`,
          height: customHeight,
          right: 0,
          top: "-4px",
        }}
        className={`absolute top-0 z-50 box-border flex h-7 cursor-default justify-between overflow-hidden rounded-lg border-2 border-emerald-300 bg-emerald-50 shadow-md shadow-emerald-500/50`}
      >
        <div className="p-2">
          <div className="mb-5 flex gap-2">
            <Radio.Group
              defaultValue={classDuration}
              onChange={(e) => setClassDuration(e.target.value)}
            >
              <div className="flex flex-row gap-2 xl:flex-row">
                <Radio value={1}>1 </Radio>
                <Radio value={1.5}>1.30 </Radio>
                <Radio value={2}>2 </Radio>
              </div>
            </Radio.Group>
            <p>{classDuration > 1 ? "Hours" : "Hour"}</p>
          </div>
          <p className="flex gap-1">
            Start from:
            <span className="font-semibold">
              {dayjs(startTime).format("H:mm")} -{" "}
              {dayjs(startTime).add(classDuration, "hour").format("H:mm")}
            </span>
          </p>
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            setStartTime(undefined);
          }}
          className="my-1 mr-1 box-border flex cursor-pointer items-center justify-center rounded-sm bg-red-400 p-2 active:bg-red-500"
        >
          <CloseOutlined
            style={{
              color: "white",
            }}
          />
        </div>
      </div>
    );
  }
};

export default SelectDateTimeCard;
