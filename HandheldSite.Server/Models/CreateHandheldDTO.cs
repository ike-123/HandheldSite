using System;

namespace HandheldSite.Server.Models
{
    public class CreateHandheldDTO
    {

        public int HandheldId {get;set;}
        public string HandheldName {get;set;}  = string.Empty;
        public string Description {get;set;}  = string.Empty;
        public IFormFile? HandheldImg {get;set;}
        public string Processor {get;set;} = string.Empty;
        public string CPU {get;set;} = string.Empty;
        public string GPU {get;set;} = string.Empty;
        public string RAM {get;set;} = string.Empty;
        public string Display {get;set;} = string.Empty;
        public string Battery {get;set;} = string.Empty;

    }
}
