import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';

import { categories } from '../constants/categories';
import { notificationOptions } from '../constants/notifications';
import type { Event, RepeatType } from '../types';
import { getTimeErrorMessage } from '../utils/timeValidation';

type EventEditorProps = {
  editingEvent: Event | null;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  location: string;
  category: string;
  isRepeating: boolean;
  repeatType: RepeatType;
  repeatInterval: number;
  repeatEndDate: string;
  notificationTime: number;
  setTitle: Dispatch<SetStateAction<string>>;
  setDate: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setLocation: Dispatch<SetStateAction<string>>;
  setCategory: Dispatch<SetStateAction<string>>;
  setIsRepeating: Dispatch<SetStateAction<boolean>>;
  setRepeatType: Dispatch<SetStateAction<RepeatType>>;
  setRepeatInterval: Dispatch<SetStateAction<number>>;
  setRepeatEndDate: Dispatch<SetStateAction<string>>;
  setNotificationTime: Dispatch<SetStateAction<number>>;
  handleStartTimeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleEndTimeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  startTimeError: string | null;
  endTimeError: string | null;
  addOrUpdateEvent: () => Promise<void>;
};

export function EventEditor({
  addOrUpdateEvent,
  category,
  date,
  description,
  editingEvent,
  endTime,
  endTimeError,
  handleEndTimeChange,
  handleStartTimeChange,
  isRepeating,
  location,
  notificationTime,
  repeatType,
  repeatInterval,
  repeatEndDate,
  setCategory,
  setDate,
  setDescription,
  setIsRepeating,
  setLocation,
  setNotificationTime,
  setRepeatType,
  setRepeatInterval,
  setRepeatEndDate,
  setTitle,
  startTime,
  startTimeError,
  title,
}: EventEditorProps) {
  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDate(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const handleLocationChange = (event: ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategory(event.target.value);
  };

  const handleRepeatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsRepeating(event.target.checked);
  };

  const handleRepeatTypeChange = (event: SelectChangeEvent<string>) => {
    setRepeatType(event.target.value as RepeatType);
  };

  const handleRepeatIntervalChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRepeatInterval(Number(event.target.value));
  };

  const handleRepeatEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRepeatEndDate(event.target.value);
  };

  const handleNotificationTimeChange = (event: SelectChangeEvent<number>) => {
    setNotificationTime(Number(event.target.value));
  };

  return (
    <Stack spacing={2} sx={{ width: '20%' }}>
      <Typography variant="h4">{editingEvent ? '일정 수정' : '일정 추가'}</Typography>

      <FormControl fullWidth>
        <FormLabel htmlFor="title">제목</FormLabel>
        <TextField id="title" size="small" value={title} onChange={handleTitleChange} />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel htmlFor="date">날짜</FormLabel>
        <TextField id="date" size="small" type="date" value={date} onChange={handleDateChange} />
      </FormControl>

      <Stack direction="row" spacing={2}>
        <FormControl fullWidth>
          <FormLabel htmlFor="start-time">시작 시간</FormLabel>
          <Tooltip title={startTimeError || ''} open={!!startTimeError} placement="top">
            <TextField
              id="start-time"
              size="small"
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              onBlur={() => getTimeErrorMessage(startTime, endTime)}
              error={!!startTimeError}
            />
          </Tooltip>
        </FormControl>
        <FormControl fullWidth>
          <FormLabel htmlFor="end-time">종료 시간</FormLabel>
          <Tooltip title={endTimeError || ''} open={!!endTimeError} placement="top">
            <TextField
              id="end-time"
              size="small"
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              onBlur={() => getTimeErrorMessage(startTime, endTime)}
              error={!!endTimeError}
            />
          </Tooltip>
        </FormControl>
      </Stack>

      <FormControl fullWidth>
        <FormLabel htmlFor="description">설명</FormLabel>
        <TextField
          id="description"
          size="small"
          value={description}
          onChange={handleDescriptionChange}
        />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel htmlFor="location">위치</FormLabel>
        <TextField id="location" size="small" value={location} onChange={handleLocationChange} />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel id="category-label">카테고리</FormLabel>
        <Select
          id="category"
          size="small"
          value={category}
          onChange={handleCategoryChange}
          aria-labelledby="category-label"
          aria-label="카테고리"
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat} aria-label={`${cat}-option`}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormControlLabel
          control={<Checkbox checked={isRepeating} onChange={handleRepeatingChange} />}
          label="반복 일정"
        />
      </FormControl>

      <FormControl fullWidth>
        <FormLabel htmlFor="notification">알림 설정</FormLabel>
        <Select
          id="notification"
          size="small"
          value={notificationTime}
          onChange={handleNotificationTimeChange}
        >
          {notificationOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {isRepeating && (
        <Stack spacing={2}>
          <FormControl fullWidth>
            <FormLabel>반복 유형</FormLabel>
            <Select size="small" value={repeatType} onChange={handleRepeatTypeChange}>
              <MenuItem value="none">반복 안함</MenuItem>
              <MenuItem value="daily">매일</MenuItem>
              <MenuItem value="weekly">매주</MenuItem>
              <MenuItem value="monthly">매월</MenuItem>
              <MenuItem value="yearly">매년</MenuItem>
            </Select>
          </FormControl>
          <Stack direction="row" spacing={2}>
            <FormControl fullWidth>
              <FormLabel>반복 간격</FormLabel>
              <TextField
                size="small"
                type="number"
                value={repeatInterval}
                onChange={handleRepeatIntervalChange}
                slotProps={{ htmlInput: { min: 1 } }}
              />
            </FormControl>
            <FormControl fullWidth>
              <FormLabel htmlFor="repeat-end-date">반복 종료일</FormLabel>
              <TextField
                id="repeat-end-date"
                size="small"
                type="date"
                value={repeatEndDate}
                onChange={handleRepeatEndDateChange}
              />
            </FormControl>
          </Stack>
        </Stack>
      )}

      <Button
        data-testid="event-submit-button"
        onClick={addOrUpdateEvent}
        variant="contained"
        color="primary"
      >
        {editingEvent ? '일정 수정' : '일정 추가'}
      </Button>
    </Stack>
  );
}
