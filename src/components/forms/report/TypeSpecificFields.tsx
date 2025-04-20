
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ReportItemFormValues } from "./schemas";

interface TypeSpecificFieldsProps {
  form: UseFormReturn<ReportItemFormValues>;
  itemType: "lost" | "found";
}

export function TypeSpecificFields({ form, itemType }: TypeSpecificFieldsProps) {
  if (itemType === "lost") {
    return (
      <>
        <FormField
          control={form.control}
          name="lastSeen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Where did you last see it?*</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 2nd floor library, near the computers"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reward (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., $20" {...field} />
              </FormControl>
              <FormDescription>
                You can offer a reward to motivate people to help
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  }

  return (
    <>
      <FormField
        control={form.control}
        name="whereFound"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Where exactly did you find it?*</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., On a table in the cafeteria"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="storedLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Where is it now? (Optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., I gave it to the front desk / I'm keeping it safely"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
