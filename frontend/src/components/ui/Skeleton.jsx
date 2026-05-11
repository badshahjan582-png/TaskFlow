import React from 'react';
import { cn } from '../../utils/cn';

const Skeleton = ({ className, ...props }) => (
  <div className={cn('skeleton', className)} {...props} />
);

export default Skeleton;
