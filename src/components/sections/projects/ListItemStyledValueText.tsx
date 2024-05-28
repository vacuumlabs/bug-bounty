type ListItemStyledValueTextProps = {
  label: string
  value: string | number | null
}

const ListItemStyledValueText = ({
  label,
  value,
}: ListItemStyledValueTextProps) => (
  <span className="text-bodyM text-grey-30">
    {`${label}: `}
    <span className="text-white">{value}</span>
  </span>
)

export default ListItemStyledValueText
