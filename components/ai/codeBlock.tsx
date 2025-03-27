export const CodeBlock = ({
  children,
  inline,
  className,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  inline?: boolean;
}) => {
  return (
    <code className={className} {...props}>
        {children}
      </code>
  );
};
