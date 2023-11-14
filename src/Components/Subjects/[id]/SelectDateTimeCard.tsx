import { useBookingModalStore } from "@/store/BookingModalStore";

type Props = {
  TIMEGRIDHEIGHT: number;
};

const SelectDateTimeCard = ({ TIMEGRIDHEIGHT }: Props) => {
  const [currentDay, selectedDay, startTime, classDuration, setStartTime] =
    useBookingModalStore((state) => [
      state.currentDay,
      state.selectedDay,
      state.startTime,
      state.classDuration,
      state.setStartTime,
    ]);

  const showSelectBar = currentDay === selectedDay && startTime !== undefined;

  if (showSelectBar) {
    return (
      <div
        style={{
          position: "absolute",
          width: `100%`,
          height: `${TIMEGRIDHEIGHT * 2 * classDuration}px`,
          right: 0,
          top: "-4px",
        }}
        className={` absolute top-0 z-50 h-7 rounded border border-emerald-500 bg-emerald-400/50 `}
        onClick={(e) => {
          e.stopPropagation();
          setStartTime(undefined);
        }}
      >
        {/* <Button
          onClick={(e) => {
            e.stopPropagation();
            setStartTime(undefined);
          }}
        >
          test
        </Button> */}
      </div>
    );
  }
};

export default SelectDateTimeCard;

{
  /* <div
                key={timeslot.id}
                style={{
                  width: `91%`,
                  top: topOffset,
                  height: heigthOfset,
                  right: 0,
                }}
                className={` absolute top-0 z-[5] h-7 rounded border ${
                  timeslot.accept
                    ? "border-rose-500 bg-rose-200/40"
                    : "border-orange-500 bg-orange-200"
                } `}
              >
                {dayjs(timeslot.start_time).format("H:mm")}
                {dayjs(timeslot.start_time)
                  .add(timeslot.duration, "hour")
                  .format("H:mm")}
                {
                  NewDateTimeMap[dayjs(timeslot.start_time).format("H:mm")]
                    .index
                }
              </div> */
}
