// Typer for mediaelementer
export type MediaItem = {
    id?: string;
    title?: string;
    date?: string;
    description?: string;
    fileUrl?: string;
    filePath?: string;
    fileType?: string; // "image" | "video" hvis du vil snevre det inn
  };
  
  
  // Typer for kontaktpersoner
  export type ContactItem = {
    id?: string;
    name: string;
    phone: string;
  };
  
  // Typer for nyhetsartikler (hvis aktuelt)
  export type NewsItem = {
    id?: string;
    title: string;
    content: string;
    date: string;
  };
  