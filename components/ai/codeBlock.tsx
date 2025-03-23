export const CodeBlock = ({children, inline, className, ...props}: {
    className?: string;
  children: React.ReactNode;
  inline: boolean;
}) => {

return(
  <div className="p-4 rounded-md overflow-x-auto text-sm bg-gray-100 dark:bg-gray-800">

  <code>{children}</code>
  </div>
)

}