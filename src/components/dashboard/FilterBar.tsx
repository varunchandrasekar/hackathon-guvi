import { format } from 'date-fns';
import { CalendarIcon, Check, Filter, X } from 'lucide-react';
import { Division, DateRange } from '@/types/transaction';
import { CATEGORIES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useTransactions } from '@/hooks/useTransactions';

interface FilterBarProps {
  divisionFilter: Division | 'all';
  onDivisionChange: (division: Division | 'all') => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  dateRange: DateRange | null;
  onDateRangeChange: (range: DateRange | null) => void;
}

const FilterBar = ({
  divisionFilter,
  onDivisionChange,
  categoryFilter,
  onCategoryChange,
  dateRange,
  onDateRangeChange,
}: FilterBarProps) => {
  const hasActiveFilters = divisionFilter !== 'all' || categoryFilter !== 'all' || dateRange !== null;

  const clearFilters = () => {
    onDivisionChange('all');
    onCategoryChange('all');
    onDateRangeChange(null);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Filters:</span>
      </div>

      <Select value={divisionFilter} onValueChange={(v) => onDivisionChange(v as Division | 'all')}>
        <SelectTrigger className="w-[140px] h-9">
          <SelectValue placeholder="Division" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Divisions</SelectItem>
          <SelectItem value="office">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-office" />
              Office
            </span>
          </SelectItem>
          <SelectItem value="personal">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-personal" />
              Personal
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[160px] h-9">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'h-9 justify-start text-left font-normal',
              !dateRange && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange ? (
              <>
                {format(dateRange.from, 'MMM d')} - {format(dateRange.to, 'MMM d')}
              </>
            ) : (
              'Date Range'
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            selected={dateRange ? { from: dateRange.from, to: dateRange.to } : undefined}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                onDateRangeChange({ from: range.from, to: range.to });
              }
            }}
            numberOfMonths={2}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-9 text-muted-foreground hover:text-destructive"
        >
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
};

export default FilterBar;
